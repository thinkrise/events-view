Yirga
=====

Coffee discovery platform.

![Codeship Status](https://www.codeship.io/projects/c2f888d0-cb4d-0131-8b51-0afac2c4186f/status "Codeship Status")

Setup yirga
-----------
Installation of all other packages requires python3.
To make sure python is installed, run the script:

		setup/python_setup

The current version used is 3.4.0. Java might not always be required, but the
installation of that requires getting the tarball, popping it on the server
(in the /tmp/ directory) and then running:

		setup/java_setup

A manual step is required that is described at the end of the script. This makes
sure the correct version is used (1.8.0 currently).

For everything else that needs to be installed go to the manifest:

		setup/build/manifest.py

and update the 'install' array to include the desired packages:

Available Packages:
- node    		v0.10.29
- activemq    v5.8.0
- glassfish   v4.0
- wildfly     v8.1.0
- tomcat      v8.0.9
- pureftpd    v1.0.36
- postgres    v9.3.4
- openssl     v1.0.1
- openssh     v6.6.1
- memcached   v1.4.14
- bind        v9.9.5
- postfix     v2.11.0
- nginx       v1.7.3


Once the desired packages are defined in the install array, return to the yirga
root and call the install script:

	bin/y_install

To define the packages to install using the above script can be done by adding
the package name as an input, e.g.:

	bin/y_install node

To change any configuration settings, the configuration files can be found in
the conf directory.


Running
-------
Set the name of the process and the command required to run it in:

		setup/run/procfile.py

To run all of the processes call:

		bin/y_run

Like the installation, inputs to the script can be used to call the desired
procfiles:

		bin/y_run node

Note: Using this currently looks like it halts the terminal, but the processes
are spawned in the background. So pressing enter will return the command line.


Killing Processes
-----------------
All processes previously spawned by y_run can be killed by calling:

		bin/y_kill

With selected processes being killed by adding the process name as an input.
