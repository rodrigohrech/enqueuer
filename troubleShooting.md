#####ZeroMQ install error:

- Python 2.6 or 2.7 as it is required by GYP. If python is not in your path, set the environment variable PYTHON to its location. For example: set PYTHON=C:\Python27\python.exe
One of:
    - Visual C++ Build Tools
    - Visual Studio 2015 Update 3, all editions including the Community edition (remember to select "Common Tools for Visual C++ 2015" feature during installation).
    - Visual Studio 2017, any edition (including the Build Tools SKU). Required Components: "MSbuild", "VC++ 2017 v141 toolset" and one of the Windows SDKs (10 or 8.1).
    - Basic Unix tools required for some tests, Git for Windows includes Git Bash and tools which can be included in the global PATH.
    - To build, launch a git shell (e.g. Cmd or PowerShell), run vcbuild.bat (to build with VS2017 you need to explicitly add a vs2017 argument), which will checkout the GYP code into build/gyp, generate uv.sln as well as the necesery related project files, and start building.