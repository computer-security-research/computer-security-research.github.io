# Source quotes (reviewer aid -- not published)

Verbatim source passages behind paraphrased claims in `paper.md`, keyed by reference
number, so a reviewer can check each paraphrase against the original wording. This file
is NOT part of the paper: the generator does not publish it, and it must be stripped (or
the few genuinely needed quotes converted to short inline quotes) before journal
submission. See the `csr-rules` skill.

Only real, fetched source text goes here. Each entry gives the source URL and the date the
text was retrieved. Quotes were lifted from the raw source pages, not a summarizer. Refs
whose exact text could not be retrieved this pass are listed under "Remaining references"
with their reason -- never with an approximate quote.

---

## [1] SELinux -- MAC binds even root

- Paper claim (Sec. 3): SELinux confines even uid-0 processes to permitted domains.
- URL: https://source.android.com/docs/security/features/selinux (retrieved Oct. 26, 2026)
- Quote: "Android uses Security-Enhanced Linux (SELinux) to enforce mandatory access
  control (MAC) over all processes, even processes running with root/superuser privileges
  (Linux capabilities)."

## [2] Kernel lockdown -- withdraws root-accessible interfaces

- Paper claim (Sec. 3): lockdown withdraws otherwise root-accessible interfaces used to
  modify the running kernel.
- URL: https://man7.org/linux/man-pages/man7/kernel_lockdown.7.html (retrieved Oct. 26, 2026)
- Quote: "The Kernel Lockdown feature is designed to prevent both direct and indirect
  access to a running kernel image, attempting to protect against unauthorized modification
  of the kernel image..."

## [3] Module-signature enforcement -- no unsigned module load

- Paper claim (Sec. 3): enforcement can require a valid signature on loaded code, so root
  cannot insert an arbitrary module.
- URL: https://docs.kernel.org/admin-guide/module-signing.html (retrieved Oct. 26, 2026)
- Quote: "This allows increased kernel security by disallowing the loading of unsigned
  modules or modules signed with an invalid key."

## [4] kernel.modules_disabled -- one-way, even root cannot reverse

- Paper claim (Sec. 3): once set, blocks all further module loading in a one-way fashion.
- URL: https://docs.kernel.org/admin-guide/sysctl/kernel.html (retrieved Oct. 26, 2026)
- Quote: "A toggle value indicating if modules are allowed to be loaded in an otherwise
  modular kernel. This toggle defaults to off (0), but can be set true (1). Once true,
  modules can be neither loaded nor unloaded, and the toggle cannot be set back to false."

## [5] Verified Boot -- hardware root of trust, refuse unsigned

- Paper claim (Sec. 3): AVB anchors the boot chain to a hardware root of trust.
- URL: https://source.android.com/docs/security/features/verifiedboot (retrieved Oct. 26, 2026)
- Quote: "Verified Boot strives to ensure all executed code comes from a trusted source
  (usually device OEMs), rather than from an attacker or corruption. It establishes a full
  chain of trust, starting from a hardware-protected root of trust to the bootloader, to the
  boot partition and other verified partitions..."

## [20] Play Integrity -- verdict tiers are hardware-backed

- Paper claim (Sec. 8): verdicts are tiered (basic / device-integrity / stronger
  hardware-backed), tied to a certified configuration.
- URL: https://developer.android.com/google/play/integrity/improvements (retrieved Oct. 26, 2026)
- Quote: "Play Integrity API already uses key attestation to obtain hardware-backed security
  signals on some devices and will now integrate them more deeply on all devices running
  Android 13 or later."

## [25] Auto Backup -- covers only apps that permit it

- Paper claim (Sec. 7): backup is enabled via the manifest; apps that disable it are omitted.
- URL: https://developer.android.com/identity/data/autobackup (retrieved Oct. 26, 2026)
- Quote: "Auto Backup for Apps automatically backs up a user's data from apps that target
  and run on Android 6.0 (API level 23) or higher." / "Your app can customize the backup
  process or opt out by disabling backups."

## [26] File-based encryption -- mandatory since Android 10, available since Android 7

- Paper claim (Sec. 7, 11): FBE mandatory on devices launched with Android 10+, available
  since Android 7.
- URL: https://source.android.com/docs/security/encryption/file-based (retrieved Oct. 26, 2026)
- Quote: "Android 7.0 and higher supports file-based encryption (FBE)." / "All devices
  launching with Android 10 and higher are required to use file-based encryption."

## [28] Play Integrity overview -- separate app- and account-integrity fields

- Paper claim (Sec. 8): the API additionally returns app-integrity and account-integrity
  fields, not reproduced in the paper's device-state table.
- URL: https://developer.android.com/google/play/integrity/overview (retrieved Oct. 26, 2026)
- Quote: "App integrity: Check that appRecognitionVerdict is PLAY_RECOGNIZED," / "Account
  details: Check that appLicensingVerdict is LICENSED,"

## [29] Key attestation -- hardware-backed key storage

- Paper claim (Sec. 8): attestation is backed by hardware-backed key storage.
- URL: https://source.android.com/docs/security/features/keystore/attestation (retrieved Oct. 26, 2026)
- Quote: "When hardware-backed key storage is available and used, key material is more secure
  against extraction from the device..."

## [30] OWASP MASTG -- device-integrity verdict verifies the environment

- Paper claim (Sec. 8, 12): apps gate on the hardware-backed device-integrity verdict.
- URL: https://mas.owasp.org/MASTG/knowledge/android/MASVS-RESILIENCE/MASTG-KNOW-0035/ (retrieved Oct. 26, 2026)
- Quote: "Device Integrity: This section presents information that verifies the authenticity
  of the Android environment in which the app is running."

## [34] GrapheneOS -- apps ban it; strong tier == hardware key attestation; no spoofing

- Paper claim (Sec. 8, 12): owner-controlled configs fail device/strong verdicts; a catalog
  of apps refuse to run; projects will not spoof attestation.
- URL: https://grapheneos.org/articles/attestation-compatibility-guide (retrieved Oct. 26, 2026)
- Quote: "Play Integrity API strong integrity level is directly based on the hardware key
  attestation API, but apps using it directly can support aftermarket operating systems..."
  / "This is a list of the apps banning GrapheneOS with the Play Integrity API..."

## [42] Full-disk encryption -- master key bound to hardware

- Paper claim (Sec. 11): the FDE master key is bound to hardware (TEE), not a copyable file.
- URL: https://source.android.com/security/encryption/full-disk (retrieved Oct. 26, 2026)
- Quote: "Added hardware-backed storage of the encryption key using Trusted Execution
  Environment's (TEE) signing capability (such as in a TrustZone)." / "The master key is
  encrypted with 128-bit AES via calls to the OpenSSL library."

## [43] GrapheneOS Auditor -- hardware-backed remote attestation from a second device

- Paper claim (Sec. 12): GrapheneOS provides hardware-backed remote attestation an owner can
  verify from a second device.
- URL: https://attestation.app/about (retrieved Oct. 26, 2026)
- Quote: "The Auditor app uses hardware-based security features to validate the identity of a
  device, along with the authenticity and integrity of the operating system. It ensures the
  device is running a verified operating system with a locked bootloader and that no
  tampering has occurred." / "Any device with Android 13 or higher can run the Auditor app
  and use it to verify other devices. However, only devices launched with Android 8.0 or
  later have the necessary hardware support for being verified."

## [50] Loadable kernel modules -- GKI module signing not supported; dm-verity instead

- Paper claim (Sec. 3): module signing is not supported for GKI vendor modules; authenticity
  rests on dm-verity over the read-only partitions.
- URL: https://source.android.com/docs/core/architecture/kernel/loadable-kernel-modules (retrieved Oct. 26, 2026)
- Quote: "Module-signing is not supported for GKI vendor modules. On devices required to
  support verified boot, Android requires kernel modules to be in the partitions that have
  dm-verity enabled. This removes the need for signing individual modules for their
  authenticity."

---

## Remaining references (quote not yet filled -- never approximated)

Pointers only; the paper's reference list carries the full citation + URL. Fill on request.

- Devsite body is JS-gated (prose not cleanly extractable by raw fetch this pass):
  [6] bootloader locking/unlocking (mandatory user-data wipe on unlock),
  [27] SafetyNet deprecation timeline, [53] boot flow.
- Open-access PDFs/pages (fetchable; quote pending): [10] NIST SP 800-101r1, [12] Amnesty
  Pegasus report, [13] MVT docs, [16] Brodbeck thesis, [19] Garfinkel anti-forensics,
  [22] Leith, [31] AttestLens, [32] SoK hardening, [44] MITRE ATT&CK, [45] Lookout Pegasus,
  [46] Citizen Lab, [47] Thompson, [48] Garfinkel/Rosenblum VMI, [49] Talos Rombertik,
  [60] rooting arms race.
- Google/vendor/legal pages (quote pending): [21] Google Play Help, [23] Device
  Configuration Service, [24] sepolicy gmscore_app.te, [33] PrivSec.dev, [35] JTAG patent,
  [54] bootloader-unlock-wall-of-shame, [55] FTC Magnuson-Moss, [56] EU Directive 2019/771,
  [57] Samsung Knox, [58] Sony unlock, [59] Qualcomm secure boot.
- Print / paywalled -- no online exact text (claim rests on the citation): [7] Rowlingson,
  [8] ISO/IEC 27043, [11] Hoog (book), [14] JoKER, [15] Bickford, [17] Chen, [18] Ruggia,
  [36] Sguigna, [37] Breeuwsma, [51] fileless-malware survey, [52] Yang.
