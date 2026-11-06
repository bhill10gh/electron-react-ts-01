export default function Hello() {
  return (
    <>
      <button onClick={() => window.electronAPI.closeWindow()}>✕</button>
      <h1>I hope you have lots of fun with this project! 😻</h1>

      <p>Piko</p>
    </>
  );
}
