const validOptions = [
  "position",
  "rotation",
  "scale",
  "rotationPost",
  "width",
  "height",
  "opacity",
  "duration",
  "delay",
  "loop",
  "fromPosition",
  "fromRotation",
  "fromScale",
  "fromRotationPost",
  "fromWidth",
  "fromHeight",
  "fromOpacity",
  "springConstant",
  "springDeceleration",
  "springMass",
  "transformOrigin",
  "easing"
];

export default function reduceOptions(options) {
  return Object.keys(options).reduce((obj, option) => {
    if (validOptions.indexOf(option) !== -1) {
      obj[option] = options[option];
    }
    return obj;
  }, {});
}
