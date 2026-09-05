allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

subprojects {
    project.plugins.withId("com.android.library") {
        val androidExt = project.extensions.findByName("android")
        if (androidExt != null) {
            val manifest = file("src/main/AndroidManifest.xml")
            if (manifest.exists()) {
                val text = manifest.readText()
                val pkg = Regex("""package="(.+?)"""").find(text)?.groupValues?.get(1)
                if (pkg != null) {
                    try {
                        val android = project.extensions.getByName("android")
                        val setNamespace = android.javaClass.getMethod("setNamespace", String::class.java)
                        val namespace = android.javaClass.getMethod("getNamespace").invoke(android)
                        if (namespace == null) {
                            setNamespace.invoke(android, pkg)
                        }
                    } catch (e: Exception) {
                        // ignore
                    }
                }
            }
        }
    }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
