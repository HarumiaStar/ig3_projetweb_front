module.exports = {
	apps: [
		{
			name: "woa-frontend",
			script: "npm",
			args: "run start",
			watch: ["src", "public"],
			watch_options: {
				"followSymlinks": false,
				"usePolling": true,
				"alwaysStat": true,
				"useFsEvents": false,
				"awaitWriteFinish": {
					"stabilityThreshold": 30000,
					"pollInterval": 1000
				}
			}
		}
	]
}
