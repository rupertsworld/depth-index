export function getMidpoint(a, b, direction) {
  if (!direction) direction = 'x';
  const x1 = a.position[direction];
  const x2 = b.position[direction];
  return (x1 + x2) / 2;
}

/* Returns a dictionary where keys = name of keypoint, value = keypoint object */
export function getKeypoints(pose, parts) {
  const keypoints = {};
  if (parts) {
    parts.forEach((part) => {
      keypoints[part] = getKeypoint(pose, part);
    })
  } else {
    pose.keypoints.forEach((keypoint) => {
      keypoints[keypoint.part] = getKeypoint(pose, keypoint.part);
    });
  }
  return keypoints;
}

export function getKeypoint(pose, part) {
  return pose.keypoints.filter((keypoint) => keypoint.part === part )[0];
}

export function getDistance(a, b) {
  const distX = a.position.x - b.position.x;
  const distY = a.position.y - b.position.y;
  return Math.sqrt(distX**2 + distY**2);
}
