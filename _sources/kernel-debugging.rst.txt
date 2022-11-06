Kernel Debugging with KVM and Ubuntu VM
=======================================

Create VM and install as per usual, I used a server variant for simplicity.
Give plenty of disk space and resources, the debug kernels and sources take up a lot of space.

Configure VM
------------
Using virt-manager, edit the VM xml:

Set the first line to:

.. code-block:: xml

    <domain type="kvm" xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>

Then add:

.. code-block:: xml

     <qemu:commandline>
          <qemu:arg value='-s'/>
     </qemu:commandline>

Alternatively, to specify the port:

.. code-block:: xml

    <qemu:commandline>
        <qemu:arg value='-gdb'/>
        <qemu:arg value='tcp::1235'/>
    </qemu:commandline>

Save and reboot.

Configure grub/kernel
---------------------

Open `/etc/defaults/grub`
Set the following:

.. code-block:: none

    GRUB_CMDLINE_LINUX_DEFAULT="console=ttyS0,115200 nokaslr nosmap nosmep"
    GRUB_CMDLINE_LINUX="console=ttyS0,115200 nokaslr nosmap nosmep"

Then:

.. code-block:: none

    sudo update-grub && reboot

Download Debug Symbols
----------------------

On the target VM:

.. code-block:: none

    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C8CAB6595FDFF622
    codename=$(lsb_release -c | awk  '{print $2}')
    sudo tee /etc/apt/sources.list.d/ddebs.list << EOF
    deb http://ddebs.ubuntu.com/ ${codename}      main restricted universe multiverse
    deb http://ddebs.ubuntu.com/ ${codename}-security main restricted universe multiverse
    deb http://ddebs.ubuntu.com/ ${codename}-updates  main restricted universe multiverse
    deb http://ddebs.ubuntu.com/ ${codename}-proposed main restricted universe multiverse
    EOF
    sudo apt update
    sudo apt install linux-image-$(uname -r)-dbgsym

On the Host:

.. code-block:: none

    mkdir temp
    cd temp
    scp -r user@host:/usr/lib/debug/boot/* ./

Download Kernel Source
----------------------

On the target VM:

.. code-block:: none

    sudo cp /etc/apt/sources.list /etc/apt/sources.list~
    sudo sed -Ei 's/^# deb-src /deb-src /' /etc/apt/sources.list
    sudo apt-get update
    sudo apt install dpkg-dev
    sudo apt-get source linux-image-unsigned-$(uname -r)


On the Host:

.. code-block:: none

    mkdir temp
    cd temp
    scp -r user@host:/linux-* ./

GDB config
----------

Edit `~/.gdbinit`:

.. code-block:: none

    file vmlinux-5.15.0-46-generic
    set substitute-path /build/linux-22xc9F/ /home/cameron/temp/
    target remote 127.0.0.1:1234
    set debuginfod enabled on
    # Set breakpoints here, or at runtime
    c

Start debugging
---------------

If you have configured .gdbinit correctly, you should be able to just run:

.. code-block:: none

    gdb

If not, you may need to run the given commands at runtime.

Troubleshooting
---------------

Cannot insert breakpoint
~~~~~~~~~~~~~~~~~~~~~~~~

Symptom:
^^^^^^^^
.. code-block:: none

    Warning:
    Cannot insert breakpoint 1.
    Cannot access memory at address 0xffffffff81b71071

Solution:
^^^^^^^^^

KASLR is enabled, make sure to properly disable it in the grub settings.

Sources:
--------

* https://www.redhat.com/en/blog/debugging-kernel-qemulibvirt
* https://hadibrais.wordpress.com/2017/03/13/installing-ubuntu-kernel-debugging-symbols/