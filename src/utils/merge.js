import { assignDefined } from 'mazey';

export default function(target, ...sources) {
  return assignDefined(target, ...sources.map(source => source || {}));
};
