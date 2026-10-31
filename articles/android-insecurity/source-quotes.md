# Source quotes

## [@aosp-selinux] SELinux -- MAC binds even root

- Paper claim (Sec. 3): SELinux confines even uid-0 processes to permitted domains.
- URL: https://source.android.com/docs/security/features/selinux (retrieved Oct. 26, 2026)
- Quote: "Android uses Security-Enhanced Linux (SELinux) to enforce mandatory access
  control (MAC) over all processes, even processes running with root/superuser privileges
  (Linux capabilities)."

## [@kernel-lockdown] Kernel lockdown -- withdraws root-accessible interfaces

- Paper claim (Sec. 3): lockdown withdraws otherwise root-accessible interfaces used to
  modify the running kernel.
- URL: https://man7.org/linux/man-pages/man7/kernel_lockdown.7.html (retrieved Oct. 26, 2026)
- Quote: "The Kernel Lockdown feature is designed to prevent both direct and indirect
  access to a running kernel image, attempting to protect against unauthorized modification
  of the kernel image..."

## [@kernel-module-signing] Module-signature enforcement -- no unsigned module load

- Paper claim (Sec. 3): enforcement can require a valid signature on loaded code, so root
  cannot insert an arbitrary module.
- URL: https://docs.kernel.org/admin-guide/module-signing.html (retrieved Oct. 26, 2026)
- Quote: "This allows increased kernel security by disallowing the loading of unsigned
  modules or modules signed with an invalid key."

## [@kernel-modules-disabled] kernel.modules_disabled -- one-way, even root cannot reverse

- Paper claim (Sec. 3): once set, blocks all further module loading in a one-way fashion.
- URL: https://docs.kernel.org/admin-guide/sysctl/kernel.html (retrieved Oct. 26, 2026)
- Quote: "A toggle value indicating if modules are allowed to be loaded in an otherwise
  modular kernel. This toggle defaults to off (0), but can be set true (1). Once true,
  modules can be neither loaded nor unloaded, and the toggle cannot be set back to false."

## [@aosp-verified-boot] Verified Boot -- hardware root of trust, refuse unsigned

- Paper claim (Sec. 3): AVB anchors the boot chain to a hardware root of trust.
- URL: https://source.android.com/docs/security/features/verifiedboot (retrieved Oct. 26, 2026)
- Quote: "Verified Boot strives to ensure all executed code comes from a trusted source
  (usually device OEMs), rather than from an attacker or corruption. It establishes a full
  chain of trust, starting from a hardware-protected root of trust to the bootloader, to the
  boot partition and other verified partitions..."

## [@play-integrity-improvements] Play Integrity -- verdict tiers are hardware-backed

- Paper claim (Sec. 8): verdicts are tiered (basic / device-integrity / stronger
  hardware-backed), tied to a certified configuration.
- URL: https://developer.android.com/google/play/integrity/improvements (retrieved Oct. 26, 2026)
- Quote: "Play Integrity API already uses key attestation to obtain hardware-backed security
  signals on some devices and will now integrate them more deeply on all devices running
  Android 13 or later."

## [@aosp-auto-backup] Auto Backup -- OS-mediated, app-configured, size-capped; covers only apps that permit it

- Paper claim (Sec. 5): the backup is mediated by the operating system -- Auto Backup includes
  only system-assigned app directories, apps include and exclude files, and it is capped per app,
  so it is partial, not a full device image.
- Paper claim (Sec. 7): backup is enabled via the manifest; apps that disable it are omitted.
- URL: https://developer.android.com/identity/data/autobackup (retrieved Oct. 26, 2026)
- Quote: "Auto Backup for Apps automatically backs up a user's data from apps that target
  and run on Android 6.0 (API level 23) or higher." / "Your app can customize the backup
  process or opt out by disabling backups." / "By default, Auto Backup includes files in most
  of the directories that are assigned to your app by the system." / "You can configure your
  app to include and exclude particular files." / "Every app can allocate up to 25 MB of
  backup data per app user."

## [@aosp-file-based-encryption] File-based encryption -- mandatory since Android 10, available since Android 7

- Paper claim (Sec. 7, 11): FBE mandatory on devices launched with Android 10+, available
  since Android 7.
- URL: https://source.android.com/docs/security/encryption/file-based (retrieved Oct. 26, 2026)
- Quote: "Android 7.0 and higher supports file-based encryption (FBE)." / "All devices
  launching with Android 10 and higher are required to use file-based encryption."

## [@play-integrity-overview] Play Integrity overview -- separate app- and account-integrity fields

- Paper claim (Sec. 8): the API additionally returns app-integrity and account-integrity
  fields, not reproduced in the paper's device-state table.
- URL: https://developer.android.com/google/play/integrity/overview (retrieved Oct. 26, 2026)
- Quote: "App integrity: Check that appRecognitionVerdict is PLAY_RECOGNIZED," / "Account
  details: Check that appLicensingVerdict is LICENSED,"

## [@aosp-key-id-attestation] Key attestation -- hardware-backed key storage

- Paper claim (Sec. 8): attestation is backed by hardware-backed key storage.
- URL: https://source.android.com/docs/security/features/keystore/attestation (retrieved Oct. 26, 2026)
- Quote: "When hardware-backed key storage is available and used, key material is more secure
  against extraction from the device..."

## [@owasp-mastg-play-integrity] OWASP MASTG -- device-integrity verdict verifies the environment

- Paper claim (Sec. 8, 12): apps gate on the hardware-backed device-integrity verdict.
- URL: https://mas.owasp.org/MASTG/knowledge/android/MASVS-RESILIENCE/MASTG-KNOW-0035/ (retrieved Oct. 26, 2026)
- Quote: "Device Integrity: This section presents information that verifies the authenticity
  of the Android environment in which the app is running."

## [@grapheneos-attestation-compat] GrapheneOS -- apps ban it; strong tier == hardware key attestation; no spoofing

- Paper claim (Sec. 8, 12): owner-controlled configs fail device/strong verdicts; a catalog
  of apps refuse to run; projects will not spoof attestation.
- URL: https://grapheneos.org/articles/attestation-compatibility-guide (retrieved Oct. 26, 2026)
- Quote: "Play Integrity API strong integrity level is directly based on the hardware key
  attestation API, but apps using it directly can support aftermarket operating systems..."
  / "This is a list of the apps banning GrapheneOS with the Play Integrity API..."

## [@aosp-full-disk-encryption] Full-disk encryption -- master key bound to hardware

- Paper claim (Sec. 11): the FDE master key is bound to hardware (TEE), not a copyable file.
- URL: https://source.android.com/security/encryption/full-disk (retrieved Oct. 26, 2026)
- Quote: "Added hardware-backed storage of the encryption key using Trusted Execution
  Environment's (TEE) signing capability (such as in a TrustZone)." / "The master key is
  encrypted with 128-bit AES via calls to the OpenSSL library."

## [@grapheneos-auditor] GrapheneOS Auditor -- hardware-backed remote attestation from a second device

- Paper claim (Sec. 12): GrapheneOS provides hardware-backed remote attestation an owner can
  verify from a second device.
- URL: https://attestation.app/about (retrieved Oct. 26, 2026)
- Quote: "The Auditor app uses hardware-based security features to validate the identity of a
  device, along with the authenticity and integrity of the operating system. It ensures the
  device is running a verified operating system with a locked bootloader and that no
  tampering has occurred." / "Any device with Android 13 or higher can run the Auditor app
  and use it to verify other devices. However, only devices launched with Android 8.0 or
  later have the necessary hardware support for being verified."

## [@aosp-loadable-kernel-modules] Loadable kernel modules -- GKI module signing not supported; dm-verity instead

- Paper claim (Sec. 3): module signing is not supported for GKI vendor modules; authenticity
  rests on dm-verity over the read-only partitions.
- URL: https://source.android.com/docs/core/architecture/kernel/loadable-kernel-modules (retrieved Oct. 26, 2026)
- Quote: "Module-signing is not supported for GKI vendor modules. On devices required to
  support verified boot, Android requires kernel modules to be in the partitions that have
  dm-verity enabled. This removes the need for signing individual modules for their
  authenticity."

---

## [@aosp-bootloader-locking] Bootloader unlock -- mandatory factory data reset

- Paper claim (Sec. 3, 13): unlocking the bootloader triggers a mandatory wipe of user data.
- URL: https://source.android.com/docs/core/architecture/bootloader/locking_unlocking (retrieved Oct. 27, 2026)
- Quote: "After the user acknowledges the warning, the device should perform a factory data
  reset to prevent unauthorized data access." (page body loads via JS; retrieved with a
  headless chromium render, not raw fetch)

## [@rowlingson-forensic-readiness] Forensic readiness -- an institutional posture, distinct from owner-inspectability

- Paper claim (Sec. 3): forensic readiness is an organization's advance preparation for
  investigators, not a property a device affords its owner.
- URL: https://www.utica.edu/academic/institutes/ecii/publications/articles/A0B13342-B4E0-1F6A-156F501C49CF5F51.pdf
  (freely hosted copy of Int. J. Digital Evidence vol. 2 no. 3, 2004; retrieved Oct. 27, 2026)
- Quote: "Forensic readiness is defined as the ability of an organisation to maximise its
  potential to use digital evidence whilst minimising the costs of an investigation."

## [@nist-sp800-101r1] NIST SP 800-101r1 -- sound acquisition; chip-off is specialized/destructive

- Paper claim (Sec. 7): inspect acquired data on a separate, known-clean computer; sound
  acquisition and evidence preservation.
- Paper claim (Sec. 9): encryption and file-based access controls pose challenges to data
  acquisition.
- Paper claim (Sec. 13): a write blocker preserves source integrity during acquisition.
- Paper claim (Sec. 7): chip-level extraction (physical removal of flash memory) is
  specialized and destructive, beyond most owners.
- URL: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-101r1.pdf
  (doi: 10.6028/NIST.SP.800-101r1; retrieved Oct. 27, 2026; chip-off quote retrieved Oct. 31, 2026)
- Quote: "its ability to maintain the integrity of the original data source being acquired
  and also that of the extracted data. The former is done by blocking or otherwise
  eliminating write requests to the device containing the data."
- Quote (chip-off): "Level 4 Chip-Off methods involve the physical removal of memory from a
  mobile device to extract data, requiring extensive training in electronic engineering and
  file system forensics." / "the risk of causing physical damage to the chip during the
  extraction process."

## [@rfc3227] RFC 3227 -- do not trust the suspect system's own programs

- Paper claim (Sec. 7): a device suspected of compromise should not be relied upon to examine
  itself using its own programs; run evidence-gathering tools from trusted, protected media.
- URL: https://www.rfc-editor.org/rfc/rfc3227.txt
  (IETF BCP 55 / RFC 3227, Feb. 2002; doi: 10.17487/RFC3227; retrieved Oct. 31, 2026)
- Quote (Sec. 2.2): "Don't trust the programs on the system. Run your evidence gathering
  programs from appropriately protected media (see below)."
- Supporting quote (Sec. 5): "you should consider that your tools might not be giving you a
  full picture of the system."

## [@mayrhofer-android-security-model] Android Platform Security Model -- per-app UID sandbox

- Paper claim (Secs. 5, 7): each app gets a distinct UNIX UID and a private directory owned by
  the app, so other apps cannot read it (the DAC application sandbox).
- URL: https://arxiv.org/abs/1904.05572v2 (arXiv:1904.05572v2, 14 Dec 2020; the 4-author
  preprint matching the cited 2021 ACM TOPS paper; retrieved Oct. 31, 2026)
- Quote (Sec. 4.3.2): "providing each application with a unique UNIX user ID (UID) and a
  directory owned by the app."
- Supporting quote (Sec. 4.3): "With very few exceptions, the process boundary is where
  security decisions are made and enforced."

## [@magisk-install] Magisk -- systemless root needs an unlocked bootloader; patches the ramdisk, not /system

- Paper claim (Sec. 8): modern rooting is systemless, patching the partition image that holds
  the ramdisk (and the init it carries) rather than /system, and still requires an unlocked
  bootloader to reflash that image, so it still forfeits the verified-boot state and
  hardware-backed verdicts. (Which partition holds the ramdisk varies by device -- boot,
  init_boot on Android 13+, or vendor_boot/recovery -- but it is never /system; the Magisk
  docs phrase it as "the partition image that contains the ramdisk".)
- URL: https://topjohnwu.github.io/Magisk/install.html (retrieved Oct. 31, 2026)
- Quote: "Your device's bootloader has to be unlocked" / "you need to patch the partition
  image that contains the ramdisk".

## [@playintegrityfork] Play Integrity Fork -- a masking module's own admission it cannot forge the hardware-backed verdict

- Paper claim (Sec. 8): integrity-masking modules spoof software-visible signals and pass only
  the basic/lock-agnostic verdict; the hardware-backed device and strong verdicts yield only to
  a leaked, unrevoked hardware keybox, not to spoofing.
- URL: https://github.com/osm0sis/PlayIntegrityFork (retrieved Oct. 31, 2026)
- Quote: "relies on locked bootloader checks to pass even DEVICE integrity" / "you can't use
  values from recent devices due to them only being allowed with full hardware backed
  attestation".
- Supporting quote: "Using Tricky Store to achieve <A13 PI STRONG integrity (with an unrevoked
  hardware keybox.xml)".

## [@amnesty-pegasus-methodology] Amnesty International -- fewer forensic traces on Android than iOS

- Paper claim (Sec. 10): significantly more forensic traces are accessible on iOS than stock
  Android, so the methodology focused on iOS; most confirmed Pegasus infections were iPhones.
- URL: https://www.amnesty.org/en/latest/research/2021/07/forensic-methodology-report-how-to-catch-nso-groups-pegasus/ (retrieved Oct. 27, 2026)
- Quote: "In Amnesty International's experience there are significantly more forensic traces
  accessible to investigators on Apple iOS devices than on stock Android devices, therefore
  our methodology is focused on the former. As a result, most recent cases of confirmed
  Pegasus infections have involved iPhones."

## [@mvt-android-methodology] MVT -- limited Android diagnostic information

- Paper claim (Sec. 10): Android stores little diagnostic information useful for triaging
  compromises and the toolkit's Android capabilities are correspondingly limited.
- URL: https://docs.mvt.re/en/latest/android/methodology/ (retrieved Oct. 27, 2026)
- Quote: "The limited diagnostic information available makes it difficult to triage potential
  compromises" / "capabilities are limited as well. However, not all is lost."

## [@guri-joker-jtag] JoKER -- an in-device detector can itself be subverted

- Paper claim (Sec. 9, 13): trustworthy rootkit detection needs a vantage point outside the
  running OS, because an in-device detector can be compromised.
- URL: doi 10.1109/Trustcom.2015.358 (IEEE; abstract record retrieved Oct. 27, 2026)
- Quote (abstract): "any detection mechanism run on the same physical device as the monitored
  OS can be compromised via application, kernel or boot-loader vulnerabilities.
  Consequentially, trusted detection of kernel rootkits in mobile devices is a challenging
  task in practice."

## [@brodbeck-covert-rootkit-detection] Brodbeck thesis -- OS-level Android rootkits demonstrated

- Paper claim (Sec. 9): rootkits running at the OS level of mobile devices have been
  demonstrated despite integrated MAC.
- URL: https://scholar.afit.edu/etd/1083 (retrieved Oct. 27, 2026)
- Quote (abstract): "This research developed kernel level rootkits for Android mobile devices
  designed to avoid traditional detection methods. The rootkits use system call hooking..." /
  "This research shows the Android's Linux kernel is vulnerable to system call hooking and
  additional measures should be implemented before handling sensitive data with Android."

## [@chen-anti-virtualization] Chen et al. -- malware checks for and thwarts analysis environments

- Paper claim (Sec. 10): measurement studies show modern malware checks for virtualized or
  instrumented environments and withholds its behavior when it detects them.
- URL: DSN 2008, doi 10.1109/DSN.2008.4630086; co-author-hosted copy
  (mdbailey.ece.illinois.edu/publications/dsn08_final.pdf) via Internet Archive snapshot
  (live origin now 404s, IEEE/Mao-page unreachable; retrieved Oct. 27, 2026)
- Quote (abstract): "Recently however, new malware instances have emerged with the capability
  to check and often thwart these defensive activities -- essentially leaving defenders blind
  to their activities."
- Quote (results): "more than 40% of the total malware samples reduce their malicious behavior
  under virtual machines or with a debugger attached"

## [@ruggia-evasive-malware] Ruggia et al. -- evasive malware detects analysis environments

- Paper claim (Sec. 10): modern malware checks whether it is under analysis and the evasion
  techniques have grown sophisticated.
- URL: doi 10.1145/3634737.3637658 (ACM ASIA CCS 2024; abstract record retrieved Oct. 27, 2026)
- Quote (abstract): "attackers pay special attention to flying under the radar of analysis
  tools, and the techniques to understand whether their app is under analysis have become
  more and more sophisticated."

## [@garfinkel-anti-forensics] Garfinkel -- anti-forensics taxonomy (wiping, chaff, planting)

- Paper claim (Sec. 10, 13): the anti-forensics literature names artifact wiping, trail
  obfuscation, and self-removal.
- URL: https://simson.net/clips/academic/2007.ICIW.AntiForensics.pdf (retrieved Oct. 27, 2026)
- Quote: "Anti-Forensics (AF) tools and techniques frustrate CFTs by erasing or altering
  information; creating \"chaff\" that wastes time and hides information; implicating innocent
  parties by planting fake evidence; exploiting implementation bugs in known tools..."

## [@leith-handset-privacy] Leith -- persistent hardware identifiers shared with Google/Apple

- Paper claim (Sec. 6): Google Play services transmits persistent hardware identifiers (IMEI,
  serial, etc.) associated with the signed-in account.
- URL: https://www.scss.tcd.ie/Doug.Leith/pubs/apple_google2.pdf (retrieved Oct. 27, 2026)
- Quote: "The phone IMEI, hardware serial number, SIM serial number and IMSI, handset phone
  number etc are shared with Apple and Google."

## [@google-device-config-service] Device Configuration Service -- device sends data to Google

- Paper claim (Sec. 6): Google documents persistent-identifier check-ins associated with the
  account and used for update eligibility.
- URL: https://support.google.com/android/answer/9021432 (retrieved Oct. 27, 2026)
- Quote: "Device Configuration Service periodically sends data from Android devices to
  Google."

## [@aosp-sepolicy-gmscore] sepolicy gmscore_app.te -- GMS core granted update-path access

- Paper claim (Sec. 6): the AOSP security policy grants Google Play services access to the
  system-update service and the A/B update engine.
- URL: https://android.googlesource.com/platform/system/sepolicy/+/refs/heads/main/private/gmscore_app.te (retrieved Oct. 27, 2026)
- Quote: "# Allow GMS core to communicate with update_engine for A/B update." /
  "allow gmscore_app update_engine_service:service_manager find;" /
  "allow gmscore_app system_update_service:service_manager find;"

## [@safetynet-attestation-deprecation] SafetyNet Attestation -- deprecated 2022, turned down January 2025

- Paper claim (Sec. 8): Google deprecated SafetyNet in 2022 and withdrew it in January 2025,
  replaced by Play Integrity.
- URL: https://developer.android.com/privacy-and-security/safetynet/deprecation-timeline
  (the deprecation-timeline page linked from the cited attestation page; JS-rendered,
  retrieved via headless chromium Oct. 27, 2026)
- Quote: "deprecated in 2022 and fully turned down in January 2025. Developers should migrate
  to the Play Integrity API that consolidates multiple integrity offerings (including the
  SafetyNet Attestation integrity verdict)..."

## [@macdonald-attestlens] AttestLens -- ~90% of apps reference neither attestation framework

- Paper claim (Sec. 8): most apps contain no reference to Play Integrity or SafetyNet; a floor
  on lock-out, not a measure of it.
- URL: https://vsgc.odu.edu/wp-content/uploads/2026/04/MacDonald_Collin_Paper.pdf (retrieved Oct. 27, 2026)
- Quote: "roughly 90% of apps in every category reference neither framework, and adoption
  remains particularly low in security-sensitive areas such as banking, cryptocurrency, and
  gaming."

## [@steinboeck-sok-hardening] SoK hardening -- developers add self-protection / jailbreak detection

- Paper claim (Sec. 8): a measurement of mobile hardening techniques; the specific per-check
  percentages the paper cites are from this study's results.
- URL: doi 10.1109/EuroSP63326.2025.00050 (IEEE EuroS&P 2025; abstract record retrieved Oct. 27, 2026)
- Quote (abstract): "the Mobile Application Security Verification Standard (MASVS) recommends
  app developers to implement hardening techniques for self-protection -- to prevent tampering
  and leakage, detect jailbreaks, etc." (NOTE: the 92.3%/94%/99% figures in the paper are from the
  study's results tables in the paywalled full text, not this abstract)

## [@privsecdev-banking-grapheneos] PrivSec.dev -- crowd-sourced banking-app compatibility list

- Paper claim (Sec. 8): crowd-sourced lists catalog banking/payment apps that refuse to run on
  owner-controlled OSes.
- URL: https://privsec.dev/posts/android/banking-applications-compatibility-with-grapheneos/ (retrieved Oct. 27, 2026)
- Quote: "Maintained Compatibility List for International Banking Apps This list includes
  banking apps that have been tested, submitted, reviewed, and verified as compatible." /
  "the crowd-sourced dataset"

## [@patent-secure-jtag] Secure-JTAG patent -- debug access gated behind authentication

- Paper claim (Sec. 9): manufacturers may lock or disable JTAG on production hardware.
- URL: https://patents.google.com/patent/US9633185B2/en (retrieved Oct. 27, 2026)
- Quote: "A method of debugging a device which includes a plurality of processors is provided.
  The method includes verifying a request to initiate authentication that is provided to the
  device to a user; performing a challenge-response authentication operation between the user
  and the device in response to the request to initiate authentication being a request from a
  non-malicious user."

## [@mitre-attack-evasion] MITRE ATT&CK -- Sandbox Evasion (T1497) and Indicator Removal (T1070)

- Paper claim (Sec. 13): the matching evasion/anti-forensic capabilities (checking for
  analysis environments; removing indicators) are catalogued.
- URL: https://attack.mitre.org/techniques/T1497/ , https://attack.mitre.org/techniques/T1070/ (retrieved Oct. 27, 2026)
- Quote (T1497): "Adversaries may employ various means to detect and avoid virtualization and
  analysis environments. This may include changing behaviors based on the results of checks
  for the presence of artifacts indicative of a virtual machine environment..."
- Quote (T1070): "Adversaries may selectively delete or modify artifacts generated to reduce
  indications of their presence and blend in with legitimate activity."

## [@lookout-chrysaor] Lookout -- Pegasus for Android self-removal

- Paper claim (Sec. 13): Pegasus for Android shipped suicide functionality to remove itself.
- URL: https://info.lookout.com/rs/051-ESQ-475/images/lookout-pegasus-android-technical-analysis.pdf (retrieved Oct. 27, 2026)
- Quote: "As seen in the iOS version of Pegasus, the Android counterpart also includes suicide
  functionality to remove itself under a variety of different circumstances."

## [@marczak-million-dollar-dissident] Citizen Lab -- iOS Pegasus self-destructs to avoid exposure

- Paper claim (Sec. 13): the iOS variant self-destructs when exposure is likely.
- URL: https://citizenlab.ca/2016/08/million-dollar-dissident-iphone-zero-day-nso-group-uae/ (retrieved Oct. 27, 2026)
- Quote: "activated automatically \"in cases where a great probability of exposing the agent
  exists.\" However, the documentation claims that sometimes Pegasus removal can result in an
  infected device rebooting immediately after removal."

## [@thompson-trusting-trust] Thompson -- a system cannot be trusted to report on itself

- Paper claim (Sec. 13): the long-established principle that a system cannot be trusted to
  report truthfully on its own state.
- URL: Thompson, "Reflections on Trusting Trust," CACM 27(8), 1984, doi 10.1145/358198.358210
  (openly hosted copy at https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf ; retrieved Oct. 27, 2026)
- Quote: "You can't trust code that you did not totally create yourself. (Especially code from
  companies that employ people like me.) No amount of source-level verification or scrutiny
  will protect you from using untrusted code."

## [@garfinkel-vmi] Garfinkel & Rosenblum VMI -- isolate the monitor, retain visibility

- Paper claim (Sec. 13): subversion-resistant detection must observe the system from outside
  the running OS.
- URL: NDSS 2003; Stanford PDF (suif.stanford.edu/papers/vmi-ndss03.pdf) via Internet Archive
  snapshot (origin unreachable this pass; retrieved Oct. 27, 2026)
- Quote: "Using this approach allows us to isolate the IDS from the monitored host but still
  retain excellent visibility into the host's state."

## [@talos-rombertik] Talos -- Rombertik destroys the host on detecting analysis

- Paper claim (Sec. 13): the nearest realized detect-then-destroy case wrecks the host rather
  than quietly erasing the implant.
- URL: https://blogs.cisco.com/security/talos/rombertik (retrieved Oct. 27, 2026)
- Quote: "If the sample detected it was being analyzed or debugged it would ultimately destroy
  the master boot record (MBR)."

## [@sudhakar-fileless-malware] Fileless-malware survey -- no on-disk artifact

- Paper claim (Sec. 10): non-persistent, memory-resident malware leaves no durable artifact
  and evades signature-based detection.
- URL: https://cybersecurity.springeropen.com/articles/10.1186/s42400-019-0043-x (CC-BY;
  JS/cookie-walled, retrieved via headless chromium render Oct. 27, 2026)
- Quote: "Fileless malware does not use traditional executables to carry-out its activities.
  So, it does not use the file system, thereby evading signature-based detection system."

## [@aosp-boot-flow] Verified Boot flow -- UNLOCKED devices show a warning screen

- Paper claim (Sec. 13): unlocking is gated behind an explicit warning (and wipe).
- URL: https://source.android.com/docs/security/features/verifiedboot/boot-flow (retrieved Oct. 27, 2026)
- Quote: "YELLOW: Warning screen for LOCKED devices with custom root of trust set / ORANGE:
  Warning screen for UNLOCKED devices / RED (eio): Warning screen for dm-verity corruption /
  RED (no os found): No valid OS found"

## [@bootloader-wall-of-shame] Wall of Shame -- crowd-sourced list of non-unlockable devices

- Paper claim (Sec. 13): a large class of carrier/vendor-locked devices cannot be unlocked by
  their owners.
- URL: https://github.com/zenfyrdev/bootloader-unlock-wall-of-shame (README, retrieved Oct. 27, 2026)
- Quote: "Bootloader Unlock: Wall of Shame" (banner title) -- a crowd-sourced tracker of
  vendors/devices that restrict bootloader unlocking; licensed CC BY-NC-SA. (README tagline
  carries a non-ASCII emoji, omitted here.)

## [@magnuson-moss-act] Magnuson-Moss Warranty Act -- anti-tying (no brand-conditioned warranty)

- Paper claim (Sec. 13): U.S. consumer-protection law limits blanket warranty voiding.
- URL: 15 U.S.C. 2302(c), via Cornell LII https://www.law.cornell.edu/uscode/text/15/2302
  (the FTC page in the citation was not machine-fetchable this pass; LII carries the
  statutory text; retrieved Oct. 27, 2026)
- Quote: "any article or service (other than article or service provided without charge under
  the terms of the warranty) which is identified by brand, trade, or corporate name" (contiguous
  span of the 2302(c) anti-tying prohibition; the LII page interleaves defined-term links)

## [@eu-directive-2019-771] EU Directive 2019/771 -- seller liability for lack of conformity

- Paper claim (Sec. 13): EU consumer law limits blanket voiding and ties refusal to a defect
  causally linked to the modification.
- URL: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L0771 (Art. 10(1);
  JS-rendered, retrieved via headless chromium Oct. 27, 2026)
- Quote: "The seller shall be liable to the consumer for any lack of conformity which exists
  at the time when the goods were delivered and which becomes apparent within two years..."
  (NOTE: the "causal link to the modification" is the paper's synthesis of the conformity-
  liability framework, not a single verbatim clause)

## [@samsung-knox-hw-security] Samsung Knox -- one-time e-fuse (Warranty Bit) is irreversible

- Paper claim (Sec. 13): unlocking permanently trips a one-time-programmable e-fuse disabling
  hardware-backed attestation, not resettable.
- URL: https://docs.samsungknox.com/admin/fundamentals/whitepaper/samsung-knox-mobile-security/system-security/hw-backed-security/ (retrieved Oct. 27, 2026)
- Quote: "This record is stored in a one-time hardware e-fuse, permanently marking the device
  as having a non approved configuration, regardless of any future actions."

## [@sony-unlock-bootloader] Sony -- unlocking removes DRM security keys

- Paper claim (Sec. 13): unlocking irrevocably erases device-unique keys that relocking does
  not restore.
- URL: https://developer.sony.com/open-source/aosp-on-xperia-open-devices/get-started/unlock-bootloader (retrieved Oct. 27, 2026)
- Quote: "content on your device may also be inaccessible due to the removal of DRM security
  keys. ... the removal of DRM security keys may affect advanced camera functionality."
  (NOTE: the "relocking does not restore" characterization is the paper's; this page documents
  that unlocking removes the DRM security keys)

## [@qualcomm-secure-boot] Qualcomm -- secure boot enabled by blowing a one-time eFuse

- Paper claim (Sec. 13): one-time-programmable eFuse hardware is the standard SoC primitive for
  secure-boot enablement and anti-rollback, a one-way operation.
- URL: https://dragonwingdocs.qualcomm.com/System/Security/enable-secure-boot (retrieved Oct. 27, 2026)
- Quote: "secure boot is guaranteed only after blowing a QFPROM, which is an eFuse. The eFuse
  configuration required to enable platform secure boot includes: Enabling image
  authentication and anti-rollback protection. Disabling debug and JTAG access."

## [@nguyen-vu-android-rooting] Rooting arms race -- evasion vs. detection

- Paper claim (Sec. 13): cloaking tools pass integrity checks only by impersonating a
  still-vulnerable stock device, in a losing arms race against detection.
- URL: doi 10.1155/2017/4121765 (Security and Communication Networks, CC-BY; open-access PDF
  via Internet Archive, Hindawi/Wiley origin Cloudflare-walled this pass; retrieved Oct. 27, 2026)
- Quote: "We present an arms race between rooting detection and rooting evasion." / "We then
  analyze the evasion loopholes and in turn enhance our rooting detection tool."

## [@zaddach-hdd-backdoor] Stealth hard-drive firmware backdoor -- below the OS, root-installable

- Paper claim (Secs. 12, 13): a drive's controller firmware can be compromised with only
  public information and reverse engineering, installed by ordinary malware after OS
  compromise, backdooring data as it is written; persistent implants have migrated to
  low-level firmware beneath the OS.
- URL: doi 10.1145/2523649.2523661 (ACSAC 2013, pp. 279-288; open PDF s3.eurecom.fr, retrieved Oct. 29, 2026)
- Quote: "we show that it is possible to compromise the firmware of a commercial off-the-shelf
  hard drive, by resorting only to public information and reverse engineering." / "a firmware
  backdoor can be installed by, e.g., traditional malware after the operating system has been
  compromised." / "the target of the infection has shifted from software components towards more
  low-level elements, such as bootloaders, virtual-machine hypervisors, computer BIOS, and
  recently even the hardware itself."

## [@kaspersky-equation] Equation nls_933w -- in-the-wild drive-firmware reprogramming

- Paper claim (Sec. 13): in-the-wild drive-firmware implants (the Equation group) reprogram the
  drive's firmware.
- URL: https://securelist.com/equation-the-death-star-of-malware-galaxy/68750/ (retrieved Oct. 29, 2026)
- Quote (article body): "It allows them to reprogram the hard drive firmware"

## [@kaspersky-equation-qa] Equation Q and A -- firmware implant survives formatting and OS reinstall

- Paper claim (Sec. 13): the drive-firmware implant persists across disk formatting and a full
  operating-system reinstall.
- URL: https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2018/03/08064459/Equation_group_questions_and_answers.pdf (Kaspersky, "Equation Group: Questions and Answers", v1.5, Feb. 2015; retrieved Oct. 30, 2026)
- Quote: "Extreme persistence that survives disk formatting and OS reinstall."

## [@eset-lojax] LoJax -- first in-the-wild UEFI rootkit, survives reinstall and disk swap

- Paper claim (Sec. 13): a UEFI implant in the motherboard's SPI flash persists across a full
  OS reinstall and even a storage replacement, because it does not reside on the storage.
- URL: https://www.welivesecurity.com/2018/09/27/lojax-first-uefi-rootkit-found-wild-courtesy-sednit-group/ (retrieved Oct. 29, 2026)
- Quote: "This persistence method is particularly invasive as it will not only survive an OS
  reinstall, but also a hard disk replacement."

## [@ermolov-intel-me] Intel ME -- chipset co-processor with privileged platform access, owner cannot inspect

- Paper claim (Sec. 13, Table 4): the Intel Management Engine is a co-processor embedded in the
  chipset, running Intel-signed firmware with privileged access to platform data, that the owner
  cannot inspect.
- URL: https://www.blackhat.com/docs/eu-17/materials/eu-17-Goryachy-How-To-Hack-A-Turned-Off-Computer-Or-Running-Unsigned-Code-In-Intel-Management-Engine-wp.pdf (Black Hat Europe 2017 whitepaper, retrieved Oct. 30, 2026)
- Quote (Sec. 1): "Intel Management Engine (Intel ME) is a proprietary technology that consists of
  a microcontroller integrated into the Platform Controller Hub (PCH) chip ... Therefore, Intel ME
  has access to almost all data on the computer."
- Quote (Sec. 1.1): "ME also has virtually unlimited access to data processed on the computer. ME
  can intercept and modify network packets as well as images on graphics cards; it has full access
  to USB devices."
- Quote (Sec. 2): "Virtually all data used by ME is either explicitly or implicitly signed by Intel."

## [@jacob-faultpm] AMD-SP/PSP -- dedicated security co-processor, root of trust, boots before the x86 cores

- Paper claim (Sec. 13, Table 4): the AMD Secure Processor (formerly PSP) is a dedicated security
  co-processor integrated into the SoC that acts as the root of trust and boots before the main
  cores, running vendor firmware the owner cannot inspect.
- URL: arXiv:2304.14717 ; doi 10.1109/EuroSP57164.2023.00069 (IEEE EuroS&P 2023, pp. 1128-1142, retrieved Oct. 30, 2026)
- Quote (Sec. 2.4): "The AMD Secure Processor (AMD-SP) is a dedicated security co-processor part of
  all recent AMD Systems-on-a-chip (SoCs) ... the AMD-SP (formerly known as Platform Security
  Processor (PSP)) has acted as the Root of Trust (RoT) of the SoC."
- Quote (Sec. 2.4.1): "The AMD-SP boots before the main X86 cores of the AMD SoC."
- Quote (Sec. 2.1.2): "Intel and AMD provide fTPMs with their Desktop CPUs, running on the Intel
  Management Engine (Intel-ME) and AMD-SP, respectively. Due to the integration of these
  coprocessors into the main die, they do not require external buses to communicate with the CPU."

## [@rfc9334-rats] RATS architecture -- Attester proves, Relying Party depends (direction of trust)

- Paper claim (Sec. 8): remote attestation is a relying-party protocol; the device is the Attester
  that must produce evidence, a Verifier appraises it, and the Relying Party (app, service, or
  platform) is the party that depends on the result, so the guarantee runs to the relying party,
  not the owner.
- URL: https://www.rfc-editor.org/rfc/rfc9334.html (IETF RFC 9334, Informational, Jan. 2023, Sec. 4.1 Roles; retrieved Oct. 30, 2026)
- Quote (Attester): "A role performed by an entity (typically a device) whose Evidence must be
  appraised in order to infer the extent to which the Attester is considered trustworthy, such as
  when deciding whether it is authorized to perform some operation."
- Quote (Relying Party): "A role performed by an entity that depends on the validity of information
  about an Attester for purposes of reliably applying application-specific actions."

## [@doctorow-general-computation] War on general-purpose computing -- owner control is the stake

- Paper claim (Sec. 8): the attestation-driven loss of owner control -- software running on the
  owner's device beyond the owner's inspection -- is the phenomenon Doctorow named the coming war
  on general-purpose computing.
- URL: https://boingboing.net/2012/01/10/lockdown.html (Boing Boing, Jan. 10, 2012; retrieved via Internet Archive snapshot Oct. 30, 2026, the live page Cloudflare-gated)
- Quote (title): "Lockdown: The coming war on general-purpose computing"

## [@play-integrity-verdicts] Play Integrity device verdict -- locked bootloader + certified image, not malware-freeness

- Paper claim (Sec. 8): the device-integrity verdict attests boot and configuration state (a
  locked bootloader and a vendor-certified OS image), not runtime malware-freeness, so a stock,
  certified, locked device can still be compromised and pass.
- URL: https://developer.android.com/google/play/integrity/verdicts (retrieved Oct. 30, 2026)
- Quote (MEETS_DEVICE_INTEGRITY): "The app is running on a genuine and certified Android device. On
  Android 13 and higher, there is hardware-backed proof that the device bootloader is locked and
  the loaded Android OS is a certified device manufacturer image."
- Quote (MEETS_BASIC_INTEGRITY): "The device bootloader can be locked or unlocked, and the
  boot state can be verified or unverified."
- Quote (MEETS_STRONG_INTEGRITY): "On Android 13 and higher, the MEETS_STRONG_INTEGRITY
  verdict requires MEETS_DEVICE_INTEGRITY and security updates in the last year for all
  partitions of the device..."

## [@play-protect-certification] Play Protect certification -- user-facing status, separate from malware protection

- Paper claim (Sec. 8): Android surfaces a Play Protect certification status to the owner in the
  Play Store, but it reports compatibility and vendor-approval and is explicitly separate from
  malware protection.
- URL: https://support.google.com/googleplay/answer/7165974 (retrieved Oct. 30, 2026)
- Quote: "Device certification is separate to Google Play Protect, which protects devices from
  harmful apps." / certified devices "Have passed Android compatibility testing."

## [@coker-remote-attestation] Principles of remote attestation -- the general definition

- Paper claim (Sec. 8): remote attestation is in general the activity of making a claim about a
  target's properties by supplying evidence to an appraiser over a network.
- URL: https://link.springer.com/article/10.1007/s10207-011-0124-7 (Int. J. Inf. Secur. 2011; abstract; retrieved Oct. 30, 2026)
- Quote (abstract): "Remote attestation is the activity of making a claim about properties of a
  target by supplying evidence to an appraiser over a network."

## [@google-triada] Triada -- malware built into OEM system images at manufacture

- Paper claim (Sec. 8): pre-installed vendor code baked into the certified image is attested as
  approved regardless of behavior; Triada was built into manufacturers' system images during
  production.
- URL: https://security.googleblog.com/2019/06/pha-family-highlights-triada.html (Google Online Security Blog, 2019; retrieved Oct. 30, 2026)
- Quote: "Triada infects device system images through a third-party during the production
  process." / "Triada was inconspicuously included in the system image as third-party code for
  additional features requested by the OEMs."

## [@apvi-platform-certs] Android platform certificates leaked, used to sign malware

- Paper claim (Sec. 12): platform signing keys have leaked and been used to sign malware in the
  wild, so the secret-key assumption behind verified boot can fail in practice.
- URL: https://bugs.chromium.org/p/apvi/issues/detail?id=100 (Android Partner Vulnerability Initiative, Issue 100, 2022; tracker returned empty on direct fetch, text corroborated via reputable press)
- Quote: "The 'android' application runs with a highly privileged user id -- android.uid.system --
  and holds system permissions, including permissions to access user data." / "Any other
  application signed with the same certificate can declare that it wants to run with the same user
  id, giving it the same level of access to the Android operating system."

## [@bootstomp] BootStomp -- bootloader vulnerabilities subvert the chain of trust

- Paper claim (Sec. 12): bootloader compromises that would subvert the verified-boot chain of
  trust have been demonstrated in research.
- URL: https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/redini (USENIX Security 2017; retrieved Oct. 30, 2026)
- Quote (abstract): "Some of these vulnerabilities would allow an attacker to execute arbitrary
  code as part of the bootloader (thus compromising the entire chain of trust)."

## [@shakevsky-trustzone] Samsung TrustZone Keymaster -- hardware key material extracted

- Paper claim (Sec. 12): a trusted-execution-environment compromise can extract the hardware key
  material underpinning the keystore and attestation (demonstrated on ~100 million Samsung
  devices, since patched).
- URL: https://eprint.iacr.org/2022/208 (USENIX Security 2022; IACR ePrint; retrieved Oct. 30, 2026)
- Quote: "We present an IV reuse attack on AES-GCM that allows an attacker to extract
  hardware-protected key material" / "our specific attacks only apply to the ~100 million devices
  made by Samsung."

## [@ncc-mediatek-bootrom] MediaTek BootROM glitch -- unpatchable mask ROM, secure-boot bypass

- Paper claim (Sec. 12): the boot ROM is the immutable hardware root of trust; a flaw in it is
  unpatchable, and voltage glitching can bypass secure-boot signature verification (physical access).
- URL: https://www.nccgroup.com/research/there-s-a-hole-in-your-soc-glitching-the-mediatek-bootrom/ (NCC Group, 2020; retrieved Oct. 30, 2026)
- Quote: "The BootROM is the immutable first stage in the boot process, and serves as the hardware
  root of trust for the SoC." / "allowing an adversary to bypass signature verification of the
  preloader." / "Because this vulnerability manifests in the mask ROM, the issue is unable to be
  patched for all in-field affected products." / "Voltage glitching attacks require physical
  access to the target device"

## [@checkm8-vu] checkm8 -- unpatchable Boot ROM (SecureROM) exploit, physical, non-persistent

- Paper claim (Sec. 12): boot-ROM flaws are permanent and unpatchable (read-only mask) and not
  specific to one vendor; the exploit needs physical access and is non-persistent.
- URL: https://kb.cert.org/vuls/id/941987/ (CERT/CC VU#941987; CVE-2019-8900; retrieved Oct. 30, 2026)
- Quote: "vulnerable to arbitrary code execution at the Boot ROM level (called \"SecureROM\" by
  Apple)" / "Because SecureROM is read-only, it cannot be patched with a firmware update." /
  "requires physical access to the device" / "The exploit is not persistent; rebooting the device
  overrides any changes"

## [@ioactive-antifuse] Antifuse key extraction -- fused root keys readable by invasive FIB

- Paper claim (Sec. 12): hardware-fused/OTP root keys can be read out by an invasive silicon
  attack, so "fused keys are unreadable" is an assumption, not an absolute (invasive, destructive,
  lab-grade).
- URL: https://arxiv.org/abs/2501.13276 (IOActive; USENIX WOOT 2025; retrieved Oct. 30, 2026)
- Quote: extraction "by a semiconductor failure analysis technique known as passive voltage
  contrast (PVC) using a focused ion beam" / "show how it can be used to extract significant
  quantities of sensitive data, such as keys for firmware encryption"

## [@opentitan-rom-patch] OpenTitan -- vendor-signed ROM-patch path (boot ROM not always immutable)

- Paper claim (Sec. 12): some SoCs expose a vendor-signed, fuse-gated ROM-patch path, so boot-ROM
  immutability is a vendor design choice, not a constant; the patch mechanism is vendor-controlled,
  never owner-controlled.
- URL: https://opentitan.org/book/hw/top_earlgrey/ip_autogen/rv_core_ibex/doc/boot-rom-patching.html (retrieved Oct. 30, 2026)
- Quote: "A separate OTP patch partition is defined within the OTP controller map." / "Patch stored
  in each region is fully signed with an appropriate cryptographic signature algorithm - RSA3072 or
  ECC384." / "The replacement is performed by re-routing instruction fetches to fetch from
  alternative addresses."

## [@aosp-device-state] AOSP Device state -- user-settable root of trust (avb_custom_key), Pixel

- Paper claim (Sec. 12): on supported devices (Pixel) the owner can enroll a custom AVB signing
  key and re-lock to it; the custom root of trust is owner-set, physically confirmed, and held in
  tamper-evident storage.
- URL: https://source.android.com/docs/security/features/verifiedboot/device-state (retrieved Oct. 30, 2026)
- Quote: "Devices can optionally allow the user to configure the root of trust (for example, a
  public key)." / "The user-settable root of trust can only be set by the end user." / "The Google
  Pixel 2 devices use this approach and the virtual partition is called avb_custom_key."

## [@nist-hwb-spec] NIST hardware write blocker -- read-only acquisition does not modify evidence

- Paper claim (Sec. 13): a write blocker passes read commands while blocking any that would alter
  the drive, so disk imaging does not modify the evidence.
- URL: https://www.nist.gov/itl/ssd/cs/cftt/upload/hwb-posted.pdf (NIST CFTT, Hardware Write Blocker Device Specification; retrieved Oct. 31, 2026)
- Quote: "The central requirement for a sound forensic examination of digital evidence is that the
  original evidence must not be modified". / "HWB-RM-01 A HWB shall block modifying commands to a
  protected storage device."

## [@halderman-coldboot] Cold-boot attack -- DRAM retains contents after power loss

- Paper claim (Sec. 13): RAM can be captured from outside the running OS by exploiting DRAM
  remanence after a cold reboot.
- URL: https://www.usenix.org/conference/17th-usenix-security-symposium/lest-we-remember-cold-boot-attacks-encryption-keys (USENIX Security 2008)
- Quote: "DRAMs used in most modern computers retain their contents for several seconds after power
  is lost, even at room temperature and even if removed from a motherboard."

## [@markettos-thunderclap] Thunderclap -- DMA peripherals can read all memory; the IOMMU now resists

- Paper claim (Sec. 13): a DMA-capable peripheral can read system memory from outside the OS, but
  modern platforms increasingly block it with an IOMMU.
- URL: https://www.ndss-symposium.org/ndss-paper/thunderclap/ (NDSS 2019)
- Quote: "DMA-enabled I/O peripherals have complete access to the state of a computer and can fully
  compromise it including reading and writing all of system memory." / "vendors have incorporated
  support for Input-Output Memory Management Units (IOMMUs), which impose memory protection on DMA".

## [@frisk-pcileech] PCILeech -- PCIe DMA reads target memory with no target driver

- Paper claim (Sec. 13): DMA over an expansion bus can capture RAM with no software on the target.
- URL: https://github.com/ufrisk/PCILeech (retrieved Oct. 31, 2026)
- Quote: "PCILeech uses PCIe hardware devices to read and write target system memory. This is
  achieved by using DMA over PCIe. No drivers are needed on the target system." (Caveat, same
  source: "Recent Windows and Linux versions block DMA by default.")

## [@muller-frost-coldboot] FROST -- on Android, cold boot first needs unlock, which wipes user data

- Paper claim (Sec. 13): the demonstrated on-device cold-boot variant on Android first required
  unlocking the bootloader, which wipes the user data it sought to recover.
- URL: https://www.cs1.tf.fau.de/frost (FROST, ACNS 2013; doi 10.1007/978-3-642-38980-1_23)
- Quote: "the bootloader must be unlocked before the attack because scrambled user partitions are
  wiped during unlocking". / "Cooling the device down under 10 degree Celsius increases the success
  of cold boot attacks considerably".

## [@android-allowbackup] android:allowBackup -- an app can exclude its data from any backup

- Paper claim (Sec. 5): a "full backup" on a non-rooted device is partial and mediated by
  individual applications, which can opt their data out via the android:allowBackup flag.
- URL: https://developer.android.com/guide/topics/manifest/application-element (retrieved Oct. 31, 2026)
- Quote: "If this attribute is set to \"false\", no backup or restore of the application is ever
  performed, disabling all cloud backups and device-to-device (D2D) transfers, even by a
  full-system backup that otherwise causes all application data to save using adb. The default
  value of this attribute is \"true\"."

---

## Remaining references (no online exact text; claim rests on the citation)

Good-faith retrieval exhausted (curl, WebFetch probe, headless chromium render, Internet
Archive, publisher abstract records). NEVER approximated.

- [@iso-27043] ISO/IEC 27043:2015 -- paywalled ISO standard; no free full text.
- [@hoog-android-forensics] Hoog, Android Forensics (Syngress, 2011) -- print book; no online full text.
- [@bickford-rootkits-smartphones] Bickford et al., HotMobile 2010 -- ACM paywalled; no open abstract/PDF retrieved.
- [@google-play-help] Google Play Help -- the cited page is the Play Help hub (a landing page of article
  links), not a single verbatim operative sentence; the account-required / remote-install-to-
  linked-device behavior the paper describes is documented across Play Help, not quotable from
  one page.
- [@sguigna-jtag-attack-surface] Sguigna, AUTOTESTCON 2019 -- IEEE paywalled; ISBN only, no DOI/open abstract (the
  JTAG-lock claim is independently backed by [@patent-secure-jtag]).
- [@breeuwsma-jtag-imaging] Breeuwsma, Digital Investigation 2006 -- Elsevier paywalled; no open abstract.
- [@yang-live-memory-acquisition] Yang et al., Digital Investigation 2017 -- Elsevier paywalled; no open abstract.
- [@weinmann-baseband] Weinmann, WOOT 2012 -- USENIX abstract page returns HTTP 403 to automated
  fetch, researchr.org mirror unreachable, and web.archive.org is blocked for this client this
  pass; abstract not retrieved verbatim. Claim (Sec. 12: baseband stacks carry remotely
  exploitable memory corruptions) rests on the citation (WOOT 2012 best-paper award).
