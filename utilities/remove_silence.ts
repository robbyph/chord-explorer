import { min, max, mean, chunk, flattenDeep } from 'lodash';

// export const SILENCE_LEVEL = 0;
export const SILENCE_LEVEL = 0.00003;

export const toBuffer = (ab: any) => {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
};

export const silenceRemovalAlgorithm = async (channelData: any) => {
  //split this into seperate chunks of a certain amount of samples
  const step = 160;
  const threshold = 0.4;
  const output: any = [];
  let _silenceCounter = 0;
  //now chunk channelData into
  chunk(channelData, step).map((frame: any) => {
    //square every value in the frame
    const squaredFrame = frame.map((x: number) => x ** 2);
    const _min: number = min(squaredFrame) || 0;
    const _max: number = max(squaredFrame) || 0;
    const _ptp = _max - _min;
    const _avg = mean(squaredFrame);
    const thd = (_min + _ptp) * threshold;
    if (_avg <= thd) {
      _silenceCounter++;
    } else {
      _silenceCounter = 0;
    }
    //if there are 20 or more consecutive 'silent' frames then ignore these frames, do not return
    if (_silenceCounter >= 20) {
      //dont append to the output
    } else {
      //append to the output
      output.push([...frame]);
    }
  });
  console.log('TCL: result -> result', flattenDeep(output).length);
  return flattenDeep(output);
};
