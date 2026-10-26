# Source quotes (reviewer aid -- not published)

Verbatim source passages behind paraphrased claims in `paper.md`, keyed by reference
number, so a reviewer can check each paraphrase against the original wording. This file
is NOT part of the paper: the generator does not publish it, and it must be stripped (or
the few genuinely needed quotes converted to short inline quotes) before journal
submission. See the `csr-rules` skill.

Only real, fetched source text goes here. Each entry gives the source URL and the date the
text was retrieved.

Coverage: seeded with the Section 3 root/kernel-mechanism cluster ([1]-[5], [50]). Other
references are filled on request.

---

## [1] SELinux -- MAC binds even root

- Paper claim (Sec. 3): "Mandatory access control through SELinux confines even uid-0
  processes to permitted domains, so that superuser identity does not by itself grant
  unrestricted operations."
- Source: Android Open Source Project, "Security-Enhanced Linux in Android."
- URL: https://source.android.com/docs/security/features/selinux (retrieved Oct. 26, 2026)
- Quote: "Android uses Security-Enhanced Linux (SELinux) to enforce mandatory access
  control (MAC) over all processes, even processes running with root/superuser privileges
  (Linux capabilities)."

## [2] Kernel lockdown -- withdraws root-accessible interfaces

- Paper claim (Sec. 3): "The kernel's lockdown facility, once engaged, withdraws a range of
  otherwise root-accessible interfaces that could be used to modify the running kernel."
- Source: "kernel_lockdown(7) -- Linux manual page", man7.org.
- URL: https://man7.org/linux/man-pages/man7/kernel_lockdown.7.html (retrieved Oct. 26, 2026)
- Quote: "The Kernel Lockdown feature is designed to prevent both direct and indirect
  access to a running kernel image, attempting to protect against unauthorized modification
  of the kernel image..."

## [3] Module-signature enforcement -- no unsigned module load

- Paper claim (Sec. 3): "Module-signature enforcement can require that any code loaded into
  the kernel carry a valid signature, so that root cannot insert an arbitrary kernel module."
- Source: The Linux Kernel, "Kernel module signing facility."
- URL: https://docs.kernel.org/admin-guide/module-signing.html (retrieved Oct. 26, 2026)
- Quote: "This allows increased kernel security by disallowing the loading of unsigned
  modules or modules signed with an invalid key."

## [4] kernel.modules_disabled -- one-way, even root cannot reverse

- Paper claim (Sec. 3): "the kernel.modules_disabled control, once set, blocks all further
  module loading until reboot in a one-way fashion that even root cannot reverse."
- Source: The Linux Kernel, "Documentation for /proc/sys/kernel/."
- URL: https://docs.kernel.org/admin-guide/sysctl/kernel.html (retrieved Oct. 26, 2026)
- Quote: "A toggle value indicating if modules are allowed to be loaded in an otherwise
  modular kernel. This toggle defaults to off (0), but can be set true (1). Once true,
  modules can be neither loaded nor unloaded, and the toggle cannot be set back to false."

## [5] Verified Boot -- hardware root of trust, refuse unsigned

- Paper claim (Sec. 3): "Android Verified Boot and a locked bootloader anchor the boot chain
  to a hardware root of trust and refuse unsigned images."
- Source: Android Open Source Project, "Verified Boot."
- URL: https://source.android.com/docs/security/features/verifiedboot (retrieved Oct. 26, 2026)
- Quote: "Verified Boot strives to ensure all executed code comes from a trusted source
  (usually device OEMs), rather than from an attacker or corruption. It establishes a full
  chain of trust, starting from a hardware-protected root of trust to the bootloader, to the
  boot partition and other verified partitions..."

## [50] Loadable kernel modules -- GKI module signing not supported; dm-verity instead

- Paper claim (Sec. 3): "Android's Generic Kernel Image does not enforce a valid signature
  on every loadable kernel module -- module signing is not supported for GKI vendor modules,
  and on devices that require verified boot the authenticity of kernel modules rests instead
  on dm-verity over the read-only partitions that hold them."
- Source: Android Open Source Project, "Loadable kernel modules."
- URL: https://source.android.com/docs/core/architecture/kernel/loadable-kernel-modules
  (retrieved Oct. 26, 2026)
- Quote: "Module-signing is not supported for GKI vendor modules. On devices required to
  support verified boot, Android requires kernel modules to be in the partitions that have
  dm-verity enabled. This removes the need for signing individual modules for their
  authenticity."
