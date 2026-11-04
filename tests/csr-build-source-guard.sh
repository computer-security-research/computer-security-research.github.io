#!/bin/bash

## Copyright (C) 2026 - 2026 ENCRYPTED SUPPORT LLC <adrelanos@kicksecure.com>
## See the file COPYING for copying conditions.

## AI-Assisted

## Regression test for csr-build's uncommitted-source guard.
##
## When committing (do_commit=1) the guard must:
##   A. REFUSE a dirty tracked source outside _site.
##   E. REFUSE an untracked (never-added) source file outside _site.
##   D. IGNORE a dirty _site (this tool's own generated output).
## and must:
##   B. PASS on a clean tree.
##   C. be SKIPPED under --no-commit (previewing a dirty tree is the point).
##
## Method: run the real bin/csr-build in a throwaway git repo with the build
## tools pointed at a nonexistent path, so a guard PASS falls through to the
## "journal-maker not found" check while a guard FIRE stops at the guard. The
## two are told apart by whether the guard message appears -- the sandbox build
## and git-push are never reached.

set -o errexit
set -o nounset
set -o pipefail
set -o errtrace
shopt -s inherit_errexit
shopt -s shift_verbose
export LC_ALL=C

## Tools missing on purpose: a guard PASS then halts at the tool check.
export CSR_JOURNAL_MAKER=/nonexistent
export CSR_DIST_AI=/nonexistent

test_dir="$(dirname -- "$(readlink --canonicalize -- "$0")")"
repo_root="$(dirname -- "${test_dir}")"
csr_build="${repo_root}/bin/csr-build"
guard_msg="uncommitted source changes"
tool_check_msg="journal-maker not found"
recheck_msg="sources changed during the build"
pushed_msg="committed + pushed"
fails=0
build_out=""
build_rc=0

if [ ! -x "${csr_build}" ]; then
   printf '%s\n' "test: csr-build not executable at ${csr_build}" >&2
   exit 1
fi

contains() {
   ## succeeds when "$1" contains the substring "$2"
   [ "${1#*"$2"}" != "$1" ]
}

make_fixture() {
   local fixture
   fixture="$(mktemp --directory)"
   git -C "${fixture}" init --quiet
   git -C "${fixture}" config user.email test@example.invalid
   git -C "${fixture}" config user.name "csr test"
   mkdir -- "${fixture}/bin" "${fixture}/_site" "${fixture}/articles"
   cp -- "${1:-${csr_build}}" "${fixture}/bin/csr-build"
   printf '%s\n' 'name = "x"' > "${fixture}/site.toml"
   printf '%s\n' 'paper source' > "${fixture}/articles/paper.md"
   printf '%s\n' '<html></html>' > "${fixture}/_site/index.html"
   ## The hooks under test are the operator's; a fixture commit must not run them.
   git -C "${fixture}" -c core.hooksPath=/dev/null add --all
   git -C "${fixture}" -c core.hooksPath=/dev/null commit --quiet --message init
   printf '%s\n' "${fixture}"
}

run_build() {
   local fixture="$1"
   shift
   build_rc=0
   build_out="$("${fixture}/bin/csr-build" "$@" 2>&1)" || build_rc=$?
}

expect_guard_fired() {
   local label="$1"
   if [ "${build_rc}" -ne 1 ]; then
      printf '%s\n' "FAIL: ${label} -- expected rc 1, got ${build_rc}" >&2
      fails=$((fails + 1))
   fi
   if ! contains "${build_out}" "${guard_msg}"; then
      printf '%s\n' "FAIL: ${label} -- expected the guard message, got: ${build_out}" >&2
      fails=$((fails + 1))
   fi
}

expect_guard_passed() {
   local label="$1"
   if contains "${build_out}" "${guard_msg}"; then
      printf '%s\n' "FAIL: ${label} -- guard fired but should have passed, got: ${build_out}" >&2
      fails=$((fails + 1))
   fi
   ## A pass must FALL THROUGH to the (stubbed-absent) tool check, not an
   ## unrelated early exit -- otherwise a missing guard message is not evidence
   ## the guard allowed execution to continue.
   if [ "${build_rc}" -ne 1 ] || ! contains "${build_out}" "${tool_check_msg}"; then
      printf '%s\n' "FAIL: ${label} -- expected to reach the tool check (rc 1 + '${tool_check_msg}'), got rc ${build_rc}: ${build_out}" >&2
      fails=$((fails + 1))
   fi
}

make_exit0_stub() {
   ## executable no-op stub: passes csr-build's [ -x ] checks and exits 0.
   cat > "$1" <<'STUB'
#!/bin/bash

exit 0
STUB
   chmod +x -- "$1"
}

run_build_full() {
   ## Run the real csr-build all the way to the commit path: build tools stubbed
   ## present, sandbox faked, HOME confined so the hardcoded staging is temp.
   local fixture="$1"
   build_rc=0
   build_out="$(
      PATH="${fakebin}:${PATH}" \
      HOME="${tmp_home}" \
      CSR_JOURNAL_MAKER="${stub_jm}" \
      CSR_DIST_AI="${stub_dist}" \
      "${fixture}/bin/csr-build" 2>&1
   )" || build_rc=$?
}

## A. dirty tracked source, committing -> guard FIRES
fixture_a="$(make_fixture)"
printf '%s\n' 'edited paper source' > "${fixture_a}/articles/paper.md"
run_build "${fixture_a}"
expect_guard_fired "A: dirty source is refused"
safe-rm --recursive --force -- "${fixture_a}"

## B. clean tree, committing -> guard PASSES (falls through to the tool check)
fixture_b="$(make_fixture)"
run_build "${fixture_b}"
expect_guard_passed "B: clean tree passes the guard"
safe-rm --recursive --force -- "${fixture_b}"

## C. dirty source, --no-commit -> guard SKIPPED
fixture_c="$(make_fixture)"
printf '%s\n' 'edited paper source' > "${fixture_c}/articles/paper.md"
run_build "${fixture_c}" --no-commit
expect_guard_passed "C: --no-commit skips the guard"
safe-rm --recursive --force -- "${fixture_c}"

## D. only _site dirty, committing -> guard PASSES (_site is excluded)
fixture_d="$(make_fixture)"
printf '%s\n' '<html>changed</html>' > "${fixture_d}/_site/index.html"
run_build "${fixture_d}"
expect_guard_passed "D: a dirty _site does not trip the guard"
safe-rm --recursive --force -- "${fixture_d}"

## E. untracked (never-added) source file, committing -> guard FIRES
fixture_e="$(make_fixture)"
printf '%s\n' '# brand new article' > "${fixture_e}/articles/newpaper.md"
run_build "${fixture_e}"
expect_guard_fired "E: an untracked new source file is refused"
safe-rm --recursive --force -- "${fixture_e}"

## Cases F/G reach the commit path (A-E halt earlier at the tool check), so the
## build tools must be present+succeeding and the sandbox render faked.
fakebin="$(mktemp --directory)"
stub_root="$(mktemp --directory)"
tmp_home="$(mktemp --directory)"
stub_jm="${stub_root}/journal-maker"
stub_dist="${stub_root}/dist-ai"

## Fake sandbox: create the pulled staging index.html AND dirty a tracked source,
## simulating a concurrent edit that races the multi-minute render.
cat > "${fakebin}/sandbox" <<'SANDBOX'
#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

staging=""
workdir=""
while [ "$#" -gt 0 ]; do
   case "$1" in
      --pull)
         staging="$2"
         shift 2
         ;;
      --workdir)
         workdir="$2"
         shift 2
         ;;
      --)
         shift
         break
         ;;
      *)
         shift
         ;;
   esac
done

mkdir --parents -- "${staging}"
printf '%s\n' '<html>built</html>' > "${staging}/index.html"
printf '%s\n' 'raced edit during render' >> "${workdir}/articles/paper.md"
SANDBOX
chmod +x -- "${fakebin}/sandbox"

make_exit0_stub "${fakebin}/git-push"
mkdir --parents -- "${stub_jm}/usr/bin" "${stub_dist}/usr/share/website-tests"
make_exit0_stub "${stub_jm}/usr/bin/journal-maker"
make_exit0_stub "${stub_dist}/usr/share/website-tests/check_site.py"
make_exit0_stub "${stub_dist}/usr/share/website-tests/check_svg_safety.py"

## F. a source edit RACES the render (lands after the clean pre-build guard) ->
## the post-build re-check FIRES and refuses before committing.
fixture_f="$(make_fixture)"
run_build_full "${fixture_f}"
if [ "${build_rc}" -ne 1 ]; then
   printf '%s\n' "FAIL: F: raced edit -- expected rc 1, got ${build_rc}: ${build_out}" >&2
   fails=$((fails + 1))
fi
if ! contains "${build_out}" "${recheck_msg}"; then
   printf '%s\n' "FAIL: F: raced edit -- expected the post-build re-check message, got: ${build_out}" >&2
   fails=$((fails + 1))
fi
if contains "${build_out}" "${pushed_msg}"; then
   printf '%s\n' "FAIL: F: raced edit -- committed despite the race, got: ${build_out}" >&2
   fails=$((fails + 1))
fi
safe-rm --recursive --force -- "${fixture_f}"

## G. CANARY: the SAME race against a pre-fix csr-build (re-check stripped) must
## NOT refuse -- it commits + pushes. Proves case F is red on the old code.
stripped="$(mktemp)"
sed '/CANARY-RECHECK-START/,/CANARY-RECHECK-END/d' "${csr_build}" > "${stripped}"
chmod +x -- "${stripped}"
if cmp --silent -- "${csr_build}" "${stripped}"; then
   printf '%s\n' "FAIL: G: canary could not strip the re-check (sentinels missing?)" >&2
   fails=$((fails + 1))
fi
fixture_g="$(make_fixture "${stripped}")"
run_build_full "${fixture_g}"
if [ "${build_rc}" -ne 0 ]; then
   printf '%s\n' "FAIL: G: canary -- pre-fix code expected rc 0, got ${build_rc}: ${build_out}" >&2
   fails=$((fails + 1))
fi
if contains "${build_out}" "${recheck_msg}"; then
   printf '%s\n' "FAIL: G: canary -- pre-fix code must not run the re-check, got: ${build_out}" >&2
   fails=$((fails + 1))
fi
if ! contains "${build_out}" "${pushed_msg}"; then
   printf '%s\n' "FAIL: G: canary -- pre-fix code should commit+push, got: ${build_out}" >&2
   fails=$((fails + 1))
fi
safe-rm --recursive --force -- "${fixture_g}"
safe-rm --force -- "${stripped}"

safe-rm --recursive --force -- "${fakebin}" "${stub_root}" "${tmp_home}"

## H. an untracked source under status.showUntrackedFiles=no still FIRES the
## pre-build guard: --untracked-files=all overrides the config, so the untracked
## file cannot be hidden. (Guard fires before the tool check -- no sandbox.)
fixture_h="$(make_fixture)"
git -C "${fixture_h}" config status.showUntrackedFiles no
printf '%s\n' '# sneaked-in article' > "${fixture_h}/articles/sneak.md"
run_build "${fixture_h}"
expect_guard_fired "H: untracked source under showUntrackedFiles=no is refused"
safe-rm --recursive --force -- "${fixture_h}"

## I. CANARY: the SAME case against a copy with --untracked-files=all stripped
## must NOT fire -- the config hides the untracked source. Proves H is red on
## the pre-fix code.
unflagged="$(mktemp)"
sed 's/ --untracked-files=all//' "${csr_build}" > "${unflagged}"
chmod +x -- "${unflagged}"
if cmp --silent -- "${csr_build}" "${unflagged}"; then
   printf '%s\n' "FAIL: I: canary could not strip --untracked-files=all (flag missing?)" >&2
   fails=$((fails + 1))
fi
fixture_i="$(make_fixture "${unflagged}")"
git -C "${fixture_i}" config status.showUntrackedFiles no
printf '%s\n' '# sneaked-in article' > "${fixture_i}/articles/sneak.md"
run_build "${fixture_i}"
expect_guard_passed "I: without -uall the config hides the untracked source"
safe-rm --recursive --force -- "${fixture_i}"
safe-rm --force -- "${unflagged}"

## J. a dirty BUILD SCRIPT is not a render input -> must NOT block (dev1355's
## over-block: a sibling editing bin/csr-build false-blocked a content deploy).
fixture_j="$(make_fixture)"
printf '%s\n' '## sibling WIP edit' >> "${fixture_j}/bin/csr-build"
run_build "${fixture_j}"
expect_guard_passed "J: a dirty build script does not block a content deploy"
safe-rm --recursive --force -- "${fixture_j}"

## K. CANARY: reverting to the old broad scope ('.' except _site) makes the SAME
## dirty build script block -- proves the positive render-input list (case J) is
## what lets a non-render edit through, i.e. J is red on the pre-fix code.
unscoped="$(mktemp)"
sed "s|-- articles pages site.toml .github/web-tests.yml|-- . ':(exclude)_site'|" "${csr_build}" > "${unscoped}"
chmod +x -- "${unscoped}"
if cmp --silent -- "${csr_build}" "${unscoped}"; then
   printf '%s\n' "FAIL: K: canary could not rewrite the render-input pathspec" >&2
   fails=$((fails + 1))
fi
fixture_k="$(make_fixture "${unscoped}")"
printf '%s\n' '## sibling WIP edit' >> "${fixture_k}/bin/csr-build"
run_build "${fixture_k}"
expect_guard_fired "K: the old broad scope blocks a dirty build script"
safe-rm --recursive --force -- "${fixture_k}"
safe-rm --force -- "${unscoped}"

## L. pages/ is a render input not named in the build invocation; it MUST still
## block -- confirms the exclude-list is fail-closed for content.
fixture_l="$(make_fixture)"
mkdir -- "${fixture_l}/pages"
printf '%s\n' '# new page' > "${fixture_l}/pages/about.md"
run_build "${fixture_l}"
expect_guard_fired "L: a dirty pages/ render input is refused"
safe-rm --recursive --force -- "${fixture_l}"

## M. .github/web-tests.yml IS copied into _site, so a dirty one MUST block --
## .github is NOT excluded as tooling. Guards against re-over-excluding .github.
fixture_m="$(make_fixture)"
mkdir -- "${fixture_m}/.github"
printf '%s\n' 'policies: [csr]' > "${fixture_m}/.github/web-tests.yml"
run_build "${fixture_m}"
expect_guard_fired "M: a dirty .github/web-tests.yml (copied into _site) is refused"
safe-rm --recursive --force -- "${fixture_m}"

## N. a dirty CI workflow is not a render input (never copied into _site) and
## MUST NOT block -- only .github/web-tests.yml under .github is a render input.
fixture_n="$(make_fixture)"
mkdir -- "${fixture_n}/.github" "${fixture_n}/.github/workflows"
printf '%s\n' '# WIP' > "${fixture_n}/.github/workflows/build.yml"
run_build "${fixture_n}"
expect_guard_passed "N: a dirty CI workflow does not block a content deploy"
safe-rm --recursive --force -- "${fixture_n}"

## O. the committed _site deploy tree stays marked linguist-generated in the REAL
## repo (not a fixture), so GitHub + CodeRabbit collapse/skip it in diffs and the
## dist-ai-style gate skips its generated HTML -- the committed-_site review-noise
## fix. A dropped .gitattributes marker silently restores that noise, so guard it;
## the paired source assertion proves the marker is scoped to _site, not blanket.
site_attr="$(git -C "${repo_root}" check-attr linguist-generated -- _site/owner-inspectability/index.html)"
if contains "${site_attr}" "linguist-generated: set"; then
   printf '%s\n' "ok O: _site is marked linguist-generated"
else
   printf '%s\n' "FAIL O: _site NOT marked linguist-generated (got: ${site_attr})" >&2
   fails=$(( fails + 1 ))
fi
src_attr="$(git -C "${repo_root}" check-attr linguist-generated -- articles/owner-inspectability/paper.md)"
if contains "${src_attr}" "linguist-generated: unspecified"; then
   printf '%s\n' "ok O: article source is not linguist-generated"
else
   printf '%s\n' "FAIL O: article source unexpectedly linguist-generated (got: ${src_attr})" >&2
   fails=$(( fails + 1 ))
fi

if [ "${fails}" -eq 0 ]; then
   printf '%s\n' "csr-build-source-guard: all 15 cases passed"
else
   printf '%s\n' "csr-build-source-guard: ${fails} case(s) failed" >&2
   exit 1
fi
