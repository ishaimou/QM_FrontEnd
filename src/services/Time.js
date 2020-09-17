class Time {
  Convert(time) {
    if (time < 60) return time + "s";
    if (time < 3600) return Math.round(time / 60) + "m";
    if (time < 86400) return Math.round(time / 3600) + "H";
    else return Math.round(time / 86400) + "d";
  }

  getTime(time) {
    let d = 0, h = 0, m = 0, s = 0;
    d = Math.trunc(time / 86400);
    time -= d * 86400;
    h = Math.trunc(time / 3600);
    time -= h * 3600;
    m = Math.trunc(time / 60);
    time -= m * 60;
    s = time;
    return (
      (d < 10 ? "0" + d : d) +
      ":" +
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":" +
      (s < 10 ? "0" + s : s)
    );
  }
}

export default new Time();
