import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

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

  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [online, setOnline] = useState(0);

  // SOCKET
  useEffect(() => {
    socket.on("load_messages", (data) => {
      setMensajes(data);
    });

    socket.on("receive_message", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    socket.on("usuarios_online", (data) => {
      setOnline(data);
    });

    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
      socket.off("usuarios_online");
    };
  }, []);

  // ENVIAR MENSAJE
  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;

    socket.emit("send_message", {
      usuario: "Edward",
      mensaje: nuevoMensaje,
    });

    setNuevoMensaje("");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex">

      {/* PANEL IZQUIERDO */}
      <div className="w-72 bg-white shadow-xl p-6 border-r border-orange-100">
        <h1 className="text-4xl font-black text-orange-500 mb-2">
          🚽 BañoRank
        </h1>

        <p className="text-gray-500 mb-4">
          Ranking universitario de baños
        </p>

        {/* ONLINE */}
        <div className="bg-green-100 text-green-700 px-3 py-2 rounded-xl font-bold">
          🟢 Online: {online}
        </div>
      </div>

      {/* PANEL CENTRAL */}
      <div className="flex-1 p-6 overflow-y-auto h-screen">

        {/* IMAGEN RESTAURADA */}
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
          <h2 className="text-4xl font-black text-orange-500">
            Baños disponibles
          </h2>

          <div className="bg-white px-5 py-3 rounded-2xl shadow font-bold text-orange-500">
            {banos.length} baños
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {banos.slice(0, 24).map((bano) => (
            <div
              key={bano.id}
              className="bg-white rounded-3xl p-5 shadow-lg border border-orange-100"
            >
              <h3 className="text-2xl font-black text-orange-500">
                Torre {bano.torre}
              </h3>

              <p>{bano.estado}</p>
              <p>⭐ {bano.rating}</p>

              <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-xl">
                Entrar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT */}
      <div className="w-96 bg-white border-l flex flex-col h-screen">

        <div className="p-5 border-b">
          <h2 className="text-3xl font-black text-orange-500">
            💬 Chat global
          </h2>

          <p className="text-sm text-gray-500">
            Usuarios conectados en tiempo real
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mensajes.map((msg, i) => (
            <div key={i} className="bg-orange-50 p-3 rounded-xl">
              <b>{msg.usuario}</b>: {msg.mensaje}
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-2 border-t">
          <input
            className="flex-1 border rounded-xl px-3"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe..."
          />

          <button
            onClick={enviarMensaje}
            className="bg-orange-500 text-white px-4 rounded-xl"
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}