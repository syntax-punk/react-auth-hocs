export function addScript(id, src, callback) {
    if (document.getElementById(id)) {
      callback();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.onload = () => {
      callback();
    };
    document.body.appendChild(script);
}