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
   cp -- "${csr_build}" "${fixture}/bin/csr-build"
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

if [ "${fails}" -eq 0 ]; then
   printf '%s\n' "csr-build-source-guard: all 5 cases passed"
else
   printf '%s\n' "csr-build-source-guard: ${fails} case(s) failed" >&2
   exit 1
fi
