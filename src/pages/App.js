import React from "react";

function App() {
  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>Hello from App</h1>
    </div>
  );
}

export default App;
