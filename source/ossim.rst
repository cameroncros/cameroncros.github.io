OSSIM - libvirt/KVM install
===========================

Steps
-----

Download ISO from: https://cdn-cybersecurity.att.com/downloads/AlienVault_OSSIM_64bits.iso
MD5: bbda3f698ffd6f84a8eb4dcf8ecfafc6

Almost no chance that this gets updated, AT&T seem to be letting OSSIM die.

Create a VM in libvirt, give it whatever specs you like. I went with a 40 GB disk.
CPU and Memory should go as high as you can afford.

Start the install as per normal.

When the packages start to install, you need to switch to a terminal (`CTRL`-`ALT`-`F2`), and run:

```
ln -s /dev/vda /dev/sda
```

This needs to be done so that the installer can install grub to the harddisk.
For some reason the installer is completely inflexible to having the main disk being anything other than /dev/sda.

Switch back and monitor the install. (`CTRL`-`ALT`-`F4`)

If you do this fast enough, and before the grub-install happens, everything should work and it will install.
