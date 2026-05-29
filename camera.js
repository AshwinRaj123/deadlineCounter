// Camera coverage validation

function canSupportSoftwareCamera(requirement, hardwareCameras) {
  const {
    minDistance,
    maxDistance,
    minLight,
    maxLight
  } = requirement;

  // Check every possible combination of distance and light
  // using coverage intervals

  for (let distance = minDistance; distance <= maxDistance; distance++) {
    for (let light = minLight; light <= maxLight; light++) {

      // Check if at least one hardware camera supports this condition
      const supported = hardwareCameras.some(camera => {
        return (
          distance >= camera.minDistance &&
          distance <= camera.maxDistance &&
          light >= camera.minLight &&
          light <= camera.maxLight
        );
      });

      // If any combination is unsupported -> fail
      if (!supported) {
        return false;
      }
    }
  }

  return true;
}


// Example Usage

const softwareRequirement = {
  minDistance: 1,
  maxDistance: 10,
  minLight: 1,
  maxLight: 5
};

const hardwareCameras = [
  {
    name: "Camera A",
    minDistance: 1,
    maxDistance: 5,
    minLight: 1,
    maxLight: 5
  },
  {
    name: "Camera B",
    minDistance: 6,
    maxDistance: 10,
    minLight: 1,
    maxLight: 5
  }
];

const result = canSupportSoftwareCamera(
  softwareRequirement,
  hardwareCameras
);

console.log("Can support software camera:", result);