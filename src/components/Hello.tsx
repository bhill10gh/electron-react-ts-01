export default function Hello() {
  return (
    <>
      <button
        className="hover:bg-red-500 hover:text-white p-2 rounded-md"
        onClick={() => window.electronAPI.closeWindow()}
      >
        ✕
      </button>
      <h1>I hope you have lots of fun with this project! 😻</h1>

      <p>Piko</p>
    </>
  );
}
