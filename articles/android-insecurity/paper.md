# Limits of Independent Security Verification on Stock Android Devices

## Abstract

Stock Android devices, as sold with a locked bootloader and without administrative (root) privileges, are general-purpose computers whose owners are structurally prevented from fully inspecting, controlling, or independently verifying the software they run. This paper examines the consequences of that design for the device owner who wishes to treat security as the ability to audit the device rather than as the platform's ability to enforce policy. It identifies a coherent set of limitations: the owner cannot practically inspect the whole system from a clean, trusted environment; app and system-update delivery is controlled by Google and the device vendor, whose compromise or coercion could enable targeted malicious installs; internal storage and live memory are inaccessible without privileges the device withholds; and remote attestation couples trustworthiness to the device remaining unmodified, producing a circular dependency in which the act of enabling inspection forfeits the trusted status that inspection seeks to validate. Low-level rootkit detection generally requires a trusted memory snapshot obtained from outside the running operating system, which stock hardware rarely permits. A structured comparison with a fully controlled host shows that most established malware-analysis techniques are unavailable without first breaking the device's own trust guarantees. The paper surveys objections, including the Mobile Verification Toolkit, and concludes that limited observability leaves absence of findings as weak evidence of integrity. The analysis is scoped to owner-centric verification and explicitly excludes digital-rights-management and platform-control objectives.

## 1. Introduction

On a stock Android device the owner is, in practice, obliged to trust Google and the device vendor for both application delivery and system updates, because the device cannot be fully examined from the outside while it remains locked down. If that trust relationship is abused -- through compromise of the delivery infrastructure, coercion of an operator, or a malicious insider -- targeted malicious installations or updates may be difficult to detect, independently verify, or prove to a third party.

The same constraints bear on ordinary malware investigation. When a device is suspected of infection, the owner typically cannot perform a thorough inspection from a separate, known-clean computer without first unlocking or modifying the device. That modification can alter the evidence under examination, and a well-constructed backdoor could detect the onset of an investigation and erase itself or conceal its traces.

This paper treats these properties not as implementation accidents but as consequences of a design in which administrative capability is deliberately withheld from the owner. It catalogs the resulting verification limits, grounds its claims in the available technical and forensic literature where such sources exist, and distinguishes claims supported by cited evidence from claims that remain asserted without a specific source.

## 2. Background

Android's security model is built around several mutually reinforcing mechanisms. Android Verified Boot (AVB) establishes a chain of trust from an immutable hardware root through the bootloader and operating-system partitions, so that only software signed by the vendor executes during startup; a locked bootloader refuses to load or boot any image that is not so signed. Application sandboxing isolates each application, giving it a distinct kernel-level user identity and a private data directory that other applications cannot read. Mandatory Access Control, implemented through SELinux, confines even privileged system processes to narrowly defined domains, so that a compromise of one component does not automatically yield access to the whole system. File-based encryption and full-disk encryption protect data at rest, with the principal encryption key bound to dedicated hardware.

These mechanisms are effective at their stated purpose: constraining what software, including malicious software, can do once it is running on the device. The design also, however, applies the same constraints to the device owner. Administrative privileges that would permit raw disk access, live memory capture, kernel instrumentation, or the booting of an external trusted environment are not exposed on a stock device. The owner is therefore placed in substantially the same position as an attacker with respect to introspection of the system, and the protections that defend the platform against modification also defend it against the owner's attempts to audit it.

## 3. Threat Model and Scope

This paper defines security from the perspective of the end user and device owner: the ability to control, inspect, and independently verify the device. Under this definition a device is more secure when its owner can establish, from a trusted vantage point, what software is installed, what it is doing, and whether it has been tampered with, and can produce evidence of that state that a skeptical third party could check.

Three practical capabilities are treated as the goals of interest: inspecting the device deeply for malware and backdoors; proving the result to a skeptical third party; and creating complete device backups suitable for independent verification.

Explicitly out of scope are digital-rights-management objectives and platform-control goals -- that is, the platform's interest in enforcing policy against the owner, in guaranteeing content protection, or in ensuring that only vendor-approved configurations run. These objectives frequently stand in tension with owner-centric verifiability, and conflating the two obscures the specific limitations examined here. Where the platform regards a property as a security feature and the owner regards the same property as an obstacle to verification, this paper describes it from the owner's standpoint and notes the platform's view where relevant.

Terminology is used consistently throughout. Stock Android denotes a typical device as sold, with a locked bootloader and without root access. Root denotes administrator-level access. A clean, trusted environment denotes a separate computer or externally booted system under the examiner's control, as opposed to the device's own currently running operating system.

## 4. Independent Verification Limits

On most stock devices it is difficult to independently verify the state of the whole system. When malware, a hidden backdoor, or tampering is suspected, the owner generally cannot examine the system from a clean, trusted environment without first modifying the device. The owner is therefore left to trust the vendor-controlled software and services that deliver applications and updates, even though those channels could themselves be abused in a targeted manner.

The underlying cause is architectural. Android is commonly shipped as a locked-down general-purpose computer in which administrative capability is deliberately withheld from the owner and the bootloader is locked. Many protections and integrity checks are implemented under vendor control, limiting what the owner can change, inspect, or replace. As a result the owner is typically prevented from inspecting the whole system and from producing a complete device backup without first bypassing these restrictions.

These restrictions bear on the three goals defined above. First, deep inspection for malware and backdoors is impeded: on a non-rooted device, many system areas, logs, and the private files of other applications are intentionally inaccessible, which makes it harder to confirm whether suspicious behavior originates from malware or from a normal system component, and harder to rule out targeted tampering. Second, the owner cannot readily prove a clean or compromised result to a third party, because the evidence that would support such a proof cannot be collected. Third, a complete device backup -- for example, a full offline image of the relevant partitions -- generally requires privileges the device restricts; on a non-rooted device "full backup" in practice means a partial backup mediated by the operating system and by individual applications.

For the same reasons, demonstrating the presence or absence of a hidden backdoor is difficult. An examiner who cannot fully inspect system files, logs, and low-level components without first modifying the device is forced to rely on what the running operating system chooses to reveal -- precisely the situation that a well-concealed backdoor would seek to establish.

## 5. Vulnerability to Targeted Malicious Upgrades

Because key parts of application and update delivery are controlled by Google and the device vendor -- Google Play for applications, the vendor for system firmware -- stock devices are exposed to the risk of targeted malicious application installations, application upgrades, and system upgrades.

A documented and ordinary feature illustrates the mechanism. Many devices permit a user to sign in to the Google Play web or desktop store using the same Google account, typically the same email address, that is used on the device. Selecting "Install" for an application in the web interface prompts the user, where multiple devices are registered, to choose a target device; the application is then installed on that device. This demonstrates that Google Play can initiate an installation to a specific, linked device without direct physical interaction with that device [1].

The concern is not that an arbitrary outsider can invoke this capability without authorization. The concern is that control of the delivery system is itself powerful. If Google Play's infrastructure were compromised, or if a privileged insider were malicious or coerced, this capability could in principle be abused to push a backdoored version of an application to a specific target. By the same logic, device manufacturers control firmware and system updates, so targeted malicious system upgrades are likewise possible if that control is abused.

Update-related communication is, moreover, not anonymous on devices certified for Google Mobile Services (GMS). Google Play services periodically checks in with Google, transmitting persistent hardware identifiers -- the IMEI, hardware serial number, network MAC address, and Google Services Framework identifier -- that Google documents as associated with the signed-in Google account and used, among other purposes, to determine a device's eligibility for software updates and security patches [2], [3]. Whether a particular firmware update is delivered through Google or through the device vendor varies by manufacturer. The AOSP security policy itself grants Google Play services access to the system-update service and to the A/B update engine, confirming its privileged role in the update path on such devices [4].

Network-level anonymization does not neutralize this exposure, because the exposure is at the identity layer rather than the network layer. Using Google Play on a stock Android device requires the device to be signed in to a Google account; the store cannot be browsed or used to install applications without one [1]. Every interaction with Google Play authenticates that account to Google, so each install or update request is bound to a specific, persistent identity. Routing the device's traffic through Tor conceals the network (IP) address from which a request originates, and in that narrow sense remains functional; but the account-based authentication required by the operating system still presents the user's Google identity to Google on every request. The network layer is thus anonymized while the identity layer is not: Tor can hide where a connection comes from, yet the device itself discloses who is making it.

## 6. Limitations of Internal Storage Access on Non-Rooted Devices

Accessing internal storage for purposes such as data recovery or malware and rootkit analysis is not reasonably easy on most stock devices. The guiding principle of malware analysis and backdoor hunting is that a device suspected of compromise should not be relied upon to examine itself; the data should ideally be inspected from a separate, known-clean computer, in keeping with established forensic guidance on sound acquisition and evidence preservation [5]. Stock Android obstructs exactly this.

The obstruction has two roots. First, internal storage is typically a soldered component that cannot be removed without specialized work. Second, Android normally blocks access to many system files and to the private files of other applications unless the device is rooted or unlocked.

Reading the storage with a different device is generally impractical for routine verification and is often unsuitable in forensic contexts. If the device is physically damaged or unbootable, the storage is also unlikely to function reliably when transplanted. Even where specialized extraction is possible -- for example, chip-level desoldering and reading -- it demands equipment and expertise that most owners do not possess [5].

The available software paths are correspondingly limited. The platform's backup facility covers only applications that permit backup: it is enabled through the application manifest and applications that disable it are omitted from the resulting archive, and the mechanism is further bounded by per-application size limits and excluded directories [6]. Approaches that would copy a full raw disk image to a computer do not work on devices that are neither rooted nor rootable, and comprehensive imaging of internal storage is generally described in the forensic literature as requiring root or an unlocked bootloader [7].

These limitations are compounded by storage encryption, which is effectively universal on recent mainstream devices: file-based encryption has been mandatory on devices that launched with Android 10 or later, and has been available since Android 7 [8]. The consequences of encrypted user data are examined further in Section 10. For most owners, therefore, inspection of internal storage is not reasonably achievable on a stock, non-rooted device.

## 7. Attestation and the Circular Trust Problem

Stock Android relies heavily on remote device attestation -- historically Google's SafetyNet Attestation API, which Google deprecated in 2022 and withdrew in January 2025 [9], now replaced by the Play Integrity API [10] -- by which the device cryptographically reports aspects of its own state to applications and services. The reported state is grounded in the device's verified-boot status [11] and backed by hardware-rooted key attestation [12]. Three classes of claim are typical, summarized in Table 1; they correspond to the device-, application-, and account-integrity verdicts the platform returns [10].

Table 1. Device attestation: what is reported to applications.

| Attestation claim | Meaning (simplified) |
| --- | --- |
| Running vendor-approved software | The device reports that it runs an operating system or build approved by the vendor, and often by Google. |
| Unmodified | The device reports that it has not been altered, for example that the bootloader has not been unlocked and the system has not been modified. |
| Locked down | The device reports that security-relevant settings remain enforced, including a locked boot chain and an expected integrity state. |

This arrangement produces a circular trust dependency, summarized in Table 2. To inspect the system deeply, the owner must modify the device -- unlock the bootloader, obtain root, or install special builds -- which causes the device to fail attestation and to be treated as untrusted by applications. To remain trusted by applications, the owner must keep the device unmodified and locked down, which denies access to the disk, memory, logs, and low-level components that independent verification requires.

Table 2. Circular trust dependency: inspection versus attestation.

| Goal | What is typically required | Consequence |
| --- | --- | --- |
| Inspect the system deeply | Modify the device (unlock bootloader, gain root, use special builds) | Device may fail attestation and be treated as untrusted by applications |
| Remain trusted by applications | Keep the device unmodified and locked down | Limits access to the disk, memory, logs, and low-level components needed for independent verification |

From the platform's standpoint this is a security feature: it raises assurance that a device presenting itself to a service is in a known, unmodified state. From the standpoint of an owner facing a high-threat situation, the same mechanism is a verification dead-end, because the only configurations in which the device is considered trustworthy are precisely those in which the owner cannot examine it.

## 8. Detection of Low-Level Rootkits

Low-level rootkits conceal themselves by manipulating the operating system itself, so that security tools running on the same device may be unable to detect them reliably. Trusted detection can require obtaining a trusted snapshot of memory from outside the monitored operating system [13].

The problem is structural rather than a matter of tool quality. Anti-virus software may successfully detect malicious applications yet remain ineffective against low-level rootkits that evade detection by masking their own presence [13]. Any detection mechanism that runs on the same physical device as the monitored operating system can itself be compromised through application, kernel, or bootloader vulnerabilities, so trusted detection of kernel rootkits on mobile devices is, in practice, a challenging task [13].

The distinction between user-space and kernel-space malware clarifies why. User-space malware can modify or inject code only into memory allocated to applications and user processes. Kernel-space malware can manipulate objects throughout the operating system's memory. Although mandatory access-control mechanisms such as SELinux are integrated into current Android versions, rootkits running at the operating-system level of mobile devices have been demonstrated [14], [15]. A rootkit is kernel-space malware that uses illicitly obtained privileges to hide its existence by manipulating the kernel's internal data structures, and code that has penetrated kernel memory can neutralize any security tool running within the operating system. A request to the kernel for, say, the contents of a directory carries no guarantee of integrity in the returned list; consequently, detecting a rootkit requires a trusted snapshot of kernel memory obtained from outside [13].

One proposed approach obtains such a snapshot through the JTAG hardware debugging interface rather than through the potentially compromised operating system. The approach exploits two debugging features: the ability to halt the processor instantly by issuing a special instruction, and the ability to read the device's volatile memory while it is halted. Because the acquisition system does not execute on the device, it can read kernel memory in a trusted manner; the captured memory is then processed by scripts that reconstruct kernel data structures and analyze them for suspicious modifications. The acquisition offers the advantage of trusted inspection precisely because it originates from outside the monitored system [13].

For most owners and most devices, JTAG-based memory acquisition is not practical. Some devices expose a JTAG interface, but it is usually not accessible to typical owners; access tends to be device-specific and to require specialized equipment and skills. No quantitative data on the proportion of devices for which JTAG is usable has been located, and the situation is highly device-specific. Manufacturers may treat JTAG as an attack surface and disable or lock it on production hardware [16], [17]: a recommended practice is to disable JTAG by default in production and end-user devices to reduce attack surface, enabling it only temporarily for authorized maintenance [17]. The same interface can nonetheless serve security analysis, and is an established forensic acquisition method for reading memory from embedded systems [18]. The approach's own authors acknowledge its awkwardness: it requires physical access to a JTAG port on the circuit board, which is cumbersome compared with software-based methods [13], [15].

On many devices, deep investigation -- including the search for sophisticated rootkits -- requires root access, and where the bootloader cannot be unlocked, researchers may be driven to rely on exploitable vulnerabilities to gain privileges temporarily. Forensic analyses report that application sandboxing, encryption, and file-based access controls pose challenges to data acquisition [5], and that temporary-root techniques, which leverage operating-system vulnerabilities to obtain elevated privileges without permanently modifying the device, are used to obtain more comprehensive access including system-level files [7].

For comparison, non-Android platforms such as desktop and server Linux provide suitable options for the same objectives. Anti-malware kernel modules designed to detect loadable-kernel-module rootkits, and runtime integrity guards, can run on the system [19], [20]. Alternatively, the system can be booted from external media and subjected to an offline integrity check using tools that verify installed files against a trusted manifest [21]. These options permit independent verification even where the original operating-system installation is itself suspected.

## 9. Malware-Analysis Capability Gaps

The constraints above translate into concrete gaps in analysis capability. This section contrasts a fully controlled general-purpose host, represented by traditional Linux desktops and servers, with a stock Android device.

On a traditional Linux host the examiner can replace the operating system, installing a known-good system or reinstalling from trusted media if compromise is suspected; boot from external media to obtain a clean, trusted environment without relying on the suspect system disk; inspect disks and memory from that trusted environment while minimizing reliance on the suspect operating system; instrument or replace the kernel to load debugging or integrity tooling; and run security tools outside the potentially compromised system, from an external host or trusted boot environment. Taken together, these capabilities permit independent verification even when the original installation is suspected to be malicious.

On a stock Android device these same capabilities are, in general, absent. The operating system cannot be freely replaced, so restoring a known-good system is usually unsupported or impractical. Booting an external, fully trusted operating system that bypasses the installed system is not supported. Full disk and memory access -- raw disk imaging, comprehensive file inspection, and live RAM capture -- is blocked without special privileges. Gaining those privileges usually breaks verified boot and attestation, causing the device to be treated as untrusted; can disable or degrade security features that depend on the device remaining locked down and unmodified; and can cause many applications, including banking, enterprise, and content-protected applications, to refuse to run. The net effect is that the tools needed to verify the system require breaking the system's trust guarantees before they can be applied.

Table 3 compares specific analysis capabilities. The values "Yes" and "No" indicate that a capability is, respectively, generally available or generally unavailable to the examiner on a stock device; "Partial" indicates that the capability exists only under significant constraints, typically requiring root, debugging permissions, or vendor or forensic access.

Table 3. Comparison of malware-analysis capabilities: traditional Linux versus stock Android.

| Aspect | Traditional Linux | Stock Android |
| --- | --- | --- |
| System access (examiner-controlled) | Yes -- full root access common in testbeds and forensic imaging | No -- root typically restricted; requires manufacturer unlock (often unavailable) or an exploit to gain privileged access |
| User-controlled root | Yes -- commonly available in lab and test environments and on self-managed systems | No -- not available on stock devices; typically requires bootloader unlock, custom builds, or an exploit |
| Raw disk imaging | Yes -- straightforward via standard forensic imaging workflows, including booting from external media | No -- not feasible on stock devices; generally requires root, an unlocked bootloader, or specialized vendor or forensic access |
| Live memory acquisition | Yes -- readily possible with standard memory-capture tooling | No -- not feasible without root; no official RAM-acquisition interfaces |
| Kernel analysis | Yes -- kernel modules can be inserted, traced, or extracted; symbols often available | No -- unavailable on stock devices without root, special builds, or vendor support |
| Kernel integrity verification | Yes -- possible using external boot media and host-controlled integrity tooling | No -- not available in a user-controlled way; verification is typically limited and vendor-controlled |
| Independent OS attestation | Yes -- possible by booting a trusted environment and performing independent integrity checks | No -- limited on stock devices; attestation and integrity guarantees are typically vendor-controlled |
| Binary reverse engineering | Yes -- straightforward access to malware files, system binaries, and logs | Partial -- possible, but often limited to application-level packages unless rooted or firmware access is available |
| Hook and injection analysis | Yes -- library preloading, process tracing, and syscall interposition easily observed | Partial -- requires rooting; SELinux and sandboxing block injection methods by default |
| Dynamic instrumentation | Yes -- tracing and debugging tools available and effective | Partial -- requires root or debugging permissions |
| Filesystem analysis | Yes -- full access to logs, temporary files, droppers, and rootkits | Partial -- the application sandbox limits access to other applications' data; root or a forensic image is required for a full view |
| Network monitoring and command-and-control analysis | Yes -- packet-capture and filtering tools usable without restriction | Partial -- requires root or VPN-based monitoring |
| External monitoring | Yes -- broad options, including out-of-band approaches and host-controlled capture and analysis | No -- limited on stock devices; out-of-band monitoring is generally unavailable without elevated access or specialized tooling |
| Log-based forensics | Yes | Partial -- limited; absence of traces after thorough manual analysis does not establish that a device was not compromised, and log-based methods may need to be combined with other forensic techniques where compromise is strongly suspected [22] |

## 10. Limitations on Encryption Key Backups

Backing up the device's encryption keys is not reasonably easy. The principal disk-encryption key is typically protected by hardware security, such as a secure element or trusted execution environment, and the Android documentation describes the key as being stored in hardware [23]. This placement makes the key far harder to copy or back up than an ordinary file.

The use of a protected master key is not in itself anomalous or an indication of a backdoor. It is the normal arrangement in most Linux desktop distributions that offer full-disk encryption. In those systems the master key is itself stored on disk, and entering the passphrase at boot decrypts not the disk directly but the master key, which in turn decrypts the volume. The arrangement allows the passphrase to be changed without re-encrypting the entire volume, since only the stored master key must be re-wrapped. The difference on a stock device is that hardware protection of the key places it beyond the owner's reach.

Backing up the key may be possible on some devices if the device still boots and root can be obtained, but for most owners this is not straightforward.

## 11. Objections and Counterarguments

A principal objection holds that practical forensic tooling for mobile devices already exists and therefore contradicts the claim that stock devices resist verification. The Mobile Verification Toolkit (MVT), a consensual forensic tool intended to help analyze mobile devices for signs of spyware, is the usual example.

There is, however, no contradiction. Such a tool can identify known indicators of compromise using the data that the device exposes, but the stock mobile operating-system design limits that observability. The toolkit's own documentation states that Android devices provide much less observability than comparable iOS devices, that Android stores very little diagnostic information useful for triaging potential compromises, and that the toolkit's Android capabilities are correspondingly limited, while noting that not all is lost [24]. Investigators are thus obliged to work with partial data and with known indicators of compromise, and a lack of findings is not definitive proof that a device was not compromised.

Independent forensic experience reinforces this. In the course of investigating NSO Group's Pegasus spyware, Amnesty International's Security Lab reported that significantly more forensic traces are accessible to investigators on Apple iOS devices than on stock Android devices, and that its methodology was focused on iOS for that reason; most recently confirmed Pegasus infections have involved iPhones [25]. The report cautions that this does not by itself establish that iOS is more secure than Android. The same report characterized the difficulty of detecting attacks even after the fact as the result of an asymmetry between the capabilities available to attackers and the protections available to targeted individuals, observed that devices other than iOS provide little to no help for consensual forensic analysis, and encouraged device vendors to make their devices more auditable without sacrificing existing security and privacy protections [25]. These observations support, rather than undermine, the conclusion that limited observability is a property of the platform design.

## 12. Discussion

The limitations examined here are not independent defects but facets of a single design choice: administrative capability is withheld from the device owner and conferred only on the vendor and manufacturer. Verified boot, sandboxing, mandatory access control, attestation, and hardware-bound key storage each advance the platform's assurance that only approved, unmodified software runs, and each simultaneously removes a means by which an owner might inspect the device from a trusted vantage point. The circular trust dependency of Section 7 is the sharpest expression of the tension: the configurations an owner would need in order to verify the device are exactly those the platform declines to trust.

The owner is consequently placed in a position analogous to that of an attacker with respect to introspection, while retaining none of an attacker's willingness to damage the device. The practical recourses -- JTAG-based memory acquisition, chip-level storage extraction, and exploit-driven temporary root -- are, respectively, rarely available, destructive or specialized, and dependent on the existence of exploitable vulnerabilities that the platform is otherwise trying to eliminate. The physical-acquisition path is further foreclosed where unlocking the bootloader triggers a mandatory wipe of user data, so that gaining access to the storage also erases its contents [26]. None of these recourses offers the routine, non-destructive, owner-driven verification that the threat model of Section 3 calls for.

The unlock procedure is, moreover, not silent to the software already running on the device. Enabling developer options and USB debugging sets flags an ordinary application can read, and the mandatory wipe destroys the user-data partition before any image of it can be taken -- so the inspection a high-threat owner attempts can itself alert, and then erase, a resident implant. That such environmental signals drive evasion is established rather than speculative: measurement studies show modern malware checks for virtualized or instrumented environments and withholds its behavior when it detects them [27], [28], and the anti-forensics literature names the matching capabilities of artifact wiping, trail obfuscation, and self-removal [29], [30]. Mobile spyware has combined the two in the wild: NSO's Pegasus for Android shipped "suicide functionality to remove itself" [31] (Suicide Functionality section), triggered among other cases when it cannot find a valid cellular subscriber identity -- behavior attributed to avoiding analysis and emulator environments -- while the iOS variant self-destructs when "a great probability of exposing the agent exists" [32] (Section 3.5), and later versions were observed deleting their own process records to hide their traces [25]. The specific loop -- an implant watching for unlock preparation and erasing itself before acquisition -- remains a reasoned extrapolation rather than a documented exploit; its constituent capabilities are each demonstrated, and the principle that a compromised system cannot be trusted to report truthfully on itself is long established [33], [34]. The nearest realized case, the Rombertik malware, destroys its host on detecting that its own code has been analyzed [35]; this is a genuine detect-then-destroy reaction, but it is keyed to tampering with the malware's own image rather than to a forensic acquisition, and it wrecks the host rather than quietly erasing the implant so the device passes inspection clean. No reported case closes the precise loop posited here.

A measured reading is that the platform optimizes for resistance to a running adversary at the cost of owner-side auditability, and that the two objectives, while not strictly incompatible, are in current designs rarely satisfied together. The forensic literature surveyed here does not claim that compromise is undetectable on stock devices; it claims that detection is constrained by observability, that negative results are weak evidence, and that auditability could be improved without abandoning existing protections. That position suggests a design space -- owner-attestable inspection modes, exportable integrity measurements, or supported trusted-boot verification paths -- in which verifiability and platform integrity might be advanced together rather than traded off.

## 13. Conclusion

Stock Android devices systematically limit the owner's ability to inspect, control, and independently verify the software they run. The owner cannot practically examine the whole system from a clean, trusted environment; application and update delivery is mediated by centralized providers whose abuse could enable targeted malicious installation; internal storage and live memory are inaccessible without withheld privileges; attestation couples trustworthiness to the device remaining unmodified; low-level rootkit detection generally demands a trusted memory snapshot taken from outside the running system; and the established techniques of host-based malware analysis are, as a class, unavailable without first breaking the device's own trust guarantees. Backing up the hardware-bound encryption key is likewise impractical for most owners. The existence of consensual forensic tooling does not overturn these conclusions, because such tooling is bounded by the limited diagnostic data the platform exposes, and an absence of findings is accordingly weak evidence of integrity. Treating security as owner-side verifiability, rather than as platform-side policy enforcement, makes these limitations visible as a coherent whole and identifies auditability as the property most in need of improvement.

## References

[1] Google. "Find and download apps and digital content on Google Play." Google Play Help. https://support.google.com/googleplay (accessed Oct. 25, 2026).

[2] D. J. Leith. "Mobile handset privacy: Measuring the data iOS and Android send to Apple and Google." in Proc. 17th EAI Int. Conf. Security and Privacy in Communication Networks (SecureComm), 2021, LNICST vol. 399. Springer. [Online]. Available: https://www.scss.tcd.ie/Doug.Leith/pubs/apple_google2.pdf (accessed Oct. 25, 2026).

[3] Google. "Android Device Configuration Service." Google Account Help. https://support.google.com/android/answer/9021432 (accessed Oct. 25, 2026).

[4] Android Open Source Project. "SELinux policy: system/sepolicy/private/gmscore_app.te." Android Googlesource. https://android.googlesource.com/platform/system/sepolicy/+/refs/heads/main/private/gmscore_app.te (accessed Oct. 25, 2026).

[5] R. Ayers, S. Brothers, and W. Jansen. "Guidelines on Mobile Device Forensics." NIST Special Publication 800-101 Revision 1, May 2014. doi: 10.6028/NIST.SP.800-101r1.

[6] Android Open Source Project. "Back up user data with Auto Backup." Android Developers. https://developer.android.com/identity/data/autobackup (accessed Oct. 25, 2026).

[7] A. Hoog. Android Forensics: Investigation, Analysis and Mobile Security for Google Android. Waltham, MA, USA: Syngress, 2011.

[8] Android Open Source Project. "File-Based Encryption." Android Developers. https://source.android.com/docs/security/encryption/file-based (accessed Oct. 25, 2026).

[9] Android Developers. "About the SafetyNet Attestation API deprecation." https://developer.android.com/training/safetynet/attestation (accessed Oct. 25, 2026).

[10] Android Developers. "Overview of the Play Integrity API." https://developer.android.com/google/play/integrity/overview (accessed Oct. 25, 2026).

[11] Android Open Source Project. "Verified Boot." https://source.android.com/docs/security/features/verifiedboot (accessed Oct. 25, 2026).

[12] Android Open Source Project. "Key and ID Attestation." https://source.android.com/docs/security/features/keystore/attestation (accessed Oct. 25, 2026).

[13] M. Guri and Y. Poliak. "JoKER: Trusted detection of kernel rootkits in Android devices via JTAG interface." in Proc. IEEE Trustcom/BigDataSE/ISPA, 2015. [Online]. Available: https://arxiv.org/abs/1512.04116 (accessed Oct. 25, 2026). **TODO:** add verified IEEE Xplore DOI for the published version.

[14] J. Bickford, R. O'Hare, A. Baliga, V. Ganapathy, and L. Iftode. "Rootkits on smart phones: Attacks, implications and opportunities." in Proc. 11th Workshop on Mobile Computing Systems and Applications (HotMobile), Annapolis, MD, USA, 2010, pp. 49-54. doi: 10.1145/1734583.1734596.

[15] R. C. Brodbeck. "Covert Android Rootkit Detection: Evaluating Mobile Device Operating System Security." M.S. thesis, Dept. Electrical and Computer Engineering, Air Force Institute of Technology, Wright-Patterson AFB, OH, USA, 2012. [Online]. Available: https://scholar.afit.edu/etd/1083 (accessed Oct. 25, 2026).

[16] "Device having secure JTAG and debugging method for the same." U.S. Patent US9633185B2. [Online]. Available: https://patents.google.com/patent/US9633185B2/en (accessed Oct. 25, 2026).

[17] A. Sguigna. "Mitigating JTAG as an attack surface." in Proc. IEEE AUTOTESTCON, National Harbor, MD, USA, 2019, pp. 1-7. ISBN 978-1-7281-2832-0. **TODO:** add verified IEEE Xplore DOI.

[18] M. F. Breeuwsma. "Forensic imaging of embedded systems using JTAG (boundary-scan)." Digital Investigation, vol. 3, no. 1, pp. 32-42, 2006. **TODO:** add verified DOI (ScienceDirect).

[19] Thalium. "rkchk: A Rust Linux kernel module for loadable-kernel-module rootkit detection." GitHub. https://github.com/thalium/rkchk (accessed Oct. 25, 2026).

[20] Openwall. "LKRG: Linux Kernel Runtime Guard." https://lkrg.org/ (accessed Oct. 25, 2026).

[21] elstel.org. "debcheckroot: boot-media integrity check of installed files." https://www.elstel.org/debcheckroot/ (accessed Oct. 25, 2026).

[22] SocialTIC. "Introduction to log-based forensics on Android devices." Consensual Digital Forensics documentation. https://forensics.socialtic.org/en/explainers/03-explainer-log-forensics-android/index.html (accessed Oct. 25, 2026).

[23] Android Open Source Project. "Full-disk encryption: storing the encrypted key." Android Developers. https://source.android.com/security/encryption/full-disk#storing_the_encrypted_key (accessed Oct. 25, 2026).

[24] Mobile Verification Toolkit. "Methodology for Android forensic." MVT Documentation. https://docs.mvt.re/en/latest/android/methodology/ (accessed Oct. 25, 2026).

[25] Amnesty International, Security Lab. "Forensic Methodology Report: How to Catch NSO Group's Pegasus." Jul. 2021. [Online]. Available: https://www.amnesty.org/en/latest/research/2021/07/forensic-methodology-report-how-to-catch-nso-groups-pegasus/ (accessed Oct. 25, 2026).

[26] Android Open Source Project. "Locking and unlocking the bootloader." Android Developers. https://source.android.com/docs/core/architecture/bootloader/locking_unlocking (accessed Oct. 25, 2026).

[27] X. Chen, J. Andersen, Z. M. Mao, M. Bailey, and J. Nazario. "Towards an understanding of anti-virtualization and anti-debugging behavior in modern malware." in Proc. IEEE/IFIP Int. Conf. Dependable Systems and Networks (DSN), 2008, pp. 177-186. doi: 10.1109/DSN.2008.4630086.

[28] A. Ruggia et al. "Unmasking the veiled: A comprehensive analysis of Android evasive malware." in Proc. ACM ASIA Conf. Computer and Communications Security (ASIA CCS), 2024. doi: 10.1145/3634737.3637658.

[29] S. Garfinkel. "Anti-forensics: Techniques, detection and countermeasures." in Proc. 2nd Int. Conf. on i-Warfare and Security (ICIW), 2007, pp. 77-84. [Online]. Available: https://simson.net/clips/academic/2007.ICIW.AntiForensics.pdf (accessed Oct. 25, 2026).

[30] MITRE. "ATT&CK knowledge base: Virtualization/Sandbox Evasion (T1497) and Indicator Removal (T1070)." https://attack.mitre.org/techniques/T1497/ (accessed Oct. 25, 2026).

[31] Lookout, Inc. "Pegasus for Android: Technical analysis and findings of Chrysaor." 2017. [Online]. Available: https://info.lookout.com/rs/051-ESQ-475/images/lookout-pegasus-android-technical-analysis.pdf (accessed Oct. 25, 2026).

[32] B. Marczak and J. Scott-Railton. "The million dollar dissident: NSO Group's iPhone zero-days used against a UAE human rights defender." Citizen Lab, University of Toronto, 2016. [Online]. Available: https://citizenlab.ca/2016/08/million-dollar-dissident-iphone-zero-day-nso-group-uae/ (accessed Oct. 25, 2026).

[33] K. Thompson. "Reflections on trusting trust." Communications of the ACM, vol. 27, no. 8, pp. 761-763, 1984. doi: 10.1145/358198.358210.

[34] T. Garfinkel and M. Rosenblum. "A virtual machine introspection based architecture for intrusion detection." in Proc. Network and Distributed System Security Symp. (NDSS), 2003, pp. 191-206. [Online]. Available: https://suif.stanford.edu/papers/vmi-ndss03.pdf (accessed Oct. 25, 2026).

[35] Cisco Talos. "Threat spotlight: Rombertik (analysis of destruct-on-analysis behavior)." 2015. [Online]. Available: https://blogs.cisco.com/security/talos/rombertik (accessed Oct. 25, 2026).
