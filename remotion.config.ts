import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null);
// "angle" is for LOCAL stills only; CI passes --gl=swiftshader explicitly.
Config.setChromiumOpenGlRenderer("angle");
