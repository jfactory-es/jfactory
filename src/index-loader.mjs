let lib;
if (process.env.NODE_ENV === "development") {
    lib = await import("jfactory/es-devel");
} else {
    lib = await import("jfactory/es");
}

// export generated by rollup-loader.config.cjs