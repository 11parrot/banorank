export default function App() {
  const torres = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const pisos = [1, 2, 3, 4, 5, 6];

  const banos = [];

  torres.forEach((torre) => {
    pisos.forEach((piso) => {
      banos.push(
        {
          id: `${torre}-${piso}-IZQ-H`,
          torre,
          piso,
          lado: "Izquierdo",
          genero: "Hombres",
          rating: 4.5,
          estado: "Limpio ✨",
        },
        {
          id: `${torre}-${piso}-IZQ-M`,
          torre,
          piso,
          lado: "Izquierdo",
          genero: "Mujeres",
          rating: 4.2,
          estado: "Con papel ✅",
        },
        {
          id: `${torre}-${piso}-DER-H`,
          torre,
          piso,
          lado: "Derecho",
          genero: "Hombres",
          rating: 3.8,
          estado: "Regular ⚠️",
        },
        {
          id: `${torre}-${piso}-DER-M`,
          torre,
          piso,
          lado: "Derecho",
          genero: "Mujeres",
          rating: 4.9,
          estado: "Excelente 🌟",
        }
      );
    });
  });

  const mensajes = [
    {
      usuario: "Kevin",
      mensaje: "El baño de Torre C piso 4 ya no tiene papel 💀",
    },
    {
      usuario: "Andrea",
      mensaje: "El baño de Torre F está limpio hoy ✨",
    },
    {
      usuario: "Luis",
      mensaje: "NO ENTREN AL J-3 DERECHO ☠️",
    },
    {
      usuario: "Camila",
      mensaje: "El baño de Torre A huele horrible 😭",
    },
    {
      usuario: "Mateo",
      mensaje: "Torre E piso 2 está GOD 🚽",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 flex">
      {/* PANEL IZQUIERDO */}
      <div className="w-72 bg-white shadow-xl p-6 border-r border-orange-100">
        <h1 className="text-4xl font-black text-orange-500 mb-2">
          🚽 BañoRank
        </h1>

        <p className="text-gray-500 mb-8">
          Ranking universitario de baños
        </p>

        <div className="space-y-6">
          <div>
            <label className="font-bold text-gray-700 block mb-2">
              Torre
            </label>

            <select className="w-full border rounded-2xl p-3 bg-orange-50">
              <option>Todas las torres</option>

              {torres.map((torre) => (
                <option key={torre}>Torre {torre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-2">
              Piso
            </label>

            <select className="w-full border rounded-2xl p-3 bg-orange-50">
              <option>Todos los pisos</option>

              {pisos.map((piso) => (
                <option key={piso}>Piso {piso}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-2">
              Género
            </label>

            <select className="w-full border rounded-2xl p-3 bg-orange-50">
              <option>Todos</option>
              <option>Hombres</option>
              <option>Mujeres</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-2">
              Estado
            </label>

            <select className="w-full border rounded-2xl p-3 bg-orange-50">
              <option>Todos</option>
              <option>Limpio ✨</option>
              <option>Sin papel 🧻</option>
              <option>Sin agua 🚫</option>
              <option>Congestionado 🚷</option>
            </select>
          </div>
        </div>
      </div>

      {/* PANEL CENTRAL */}
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        {/* BANNER */}
        <div className="relative h-72 rounded-3xl overflow-hidden mb-8 shadow-xl">
          <img
            src="/campus.jpeg"
            alt="Campus"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center">
            <h1 className="text-6xl font-black text-white">
              🚽 BañoRank
            </h1>

            <p className="text-white text-xl mt-3">
              Estado de baños universitarios en tiempo real
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-black text-orange-500">
              Baños disponibles
            </h2>

            <p className="text-gray-500 mt-1">
              Explora baños por torre y piso
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow font-bold text-orange-500">
            {banos.length} baños registrados
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {banos.slice(0, 24).map((bano) => (
            <div
              key={bano.id}
              className="bg-white rounded-3xl p-5 shadow-lg border border-orange-100 hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-orange-500">
                  Torre {bano.torre}
                </h3>

                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                  Piso {bano.piso}
                </span>
              </div>

              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-bold">Lado:</span> {bano.lado}
                </p>

                <p>
                  <span className="font-bold">Baño:</span> {bano.genero}
                </p>

                <p>
                  <span className="font-bold">Estado:</span> {bano.estado}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-yellow-500 font-bold text-lg">
                  ⭐ {bano.rating}
                </div>

                <div className="text-sm text-gray-500">
                  32 usuarios activos
                </div>
              </div>

              <button className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-bold transition-all">
                Entrar al baño
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT */}
      <div className="w-96 bg-white border-l border-orange-100 flex flex-col h-screen shadow-2xl">
        <div className="p-5 border-b border-orange-100">
          <h2 className="text-3xl font-black text-orange-500">
            💬 Chat en vivo
          </h2>

          <p className="text-gray-500 mt-1">
            142 estudiantes conectados
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mensajes.map((msg, index) => (
            <div
              key={index}
              className="bg-orange-50 p-4 rounded-2xl border border-orange-100"
            >
              <p className="font-black text-orange-500 mb-1">
                {msg.usuario}
              </p>

              <p className="text-gray-700">{msg.mensaje}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-orange-100 flex gap-3">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-2xl font-bold">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}