import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Auth from "./pages/Auth.jsx";

const socket = io("http://localhost:3000", {
  autoConnect: false,
});

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username] = useState(localStorage.getItem("username"));

  const [socketConnected, setSocketConnected] = useState(false);
  const [online, setOnline] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  
  const [banosBD, setBanosBD] = useState([]);
  const [reportes, setReportes] = useState([]);

  // Chat del sistema
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const chatEndRef = useRef(null);

  // Formulario
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("good");
  const [comment, setComment] = useState("");

  const torres = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const pisos = [1, 2, 3, 4, 5, 6];

  // Auto-scroll del chat automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    if (!token) return;

    socket.auth = { token, username };
    socket.connect();

    // Evento de conexión limpia
    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("join", username); // Avisa al backend que entramos
    });

    socket.on("load_bathrooms", setBanosBD);
    socket.on("ranking_updated", setBanosBD);
    socket.on("load_reports", setReportes);
    
    // Escucha el historial persistente guardado en la base de datos
    socket.on("load_chat_history", (history) => {
      const formattedHistory = history.map(msg => ({
        id: msg.id,
        usuario: msg.username,
        mensaje: msg.message,
        color: msg.color,
        createdAt: msg.createdAt
      }));
      setMensajes(formattedHistory);
    });

    socket.on("new_report_received", (data) => {
      setReportes((prev) => [data, ...prev].slice(0, 10));
    });
    
    socket.on("receive_message", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    // Actualización instantánea del número de conectados
    socket.on("users_online", (count) => {
      setOnline(count);
    });

    socket.on("users_list", (list) => {
      setUsuarios(list);
    });

    return () => {
      socket.off("connect");
      socket.off("load_bathrooms");
      socket.off("ranking_updated");
      socket.off("load_reports");
      socket.off("load_chat_history");
      socket.off("new_report_received");
      socket.off("receive_message");
      socket.off("users_online");
      socket.off("users_list");
      socket.disconnect();
    };
  }, [token, username]);

  // Ejecución de envío de mensajes
  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;

    socket.emit("send_message", {
      mensaje: nuevoMensaje,
    });

    setNuevoMensaje("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      enviarMensaje();
    }
  };

  // Envío del reporte satelital
  const enviarReporte = (e) => {
    e.preventDefault();
    if (!selectedBathroom) return alert("Por favor, selecciona un baño.");

    socket.emit("send_report", {
      bathroomId: selectedBathroom,
      status: selectedStatus,
      comment: comment,
    });

    setComment("");
    alert("¡Reporte enviado exitosamente!");
  };

  if (!token) {
    return <Auth onLogin={setToken} />;
  }

  if (!socketConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 font-sans font-bold">
        Conectando al servidor central...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans h-screen overflow-hidden text-gray-800">

      {/* PANEL IZQUIERDO: USUARIOS Y CONTROL */}
      <div className="w-64 bg-white p-5 border-r border-gray-200 flex flex-col justify-between h-full">
        <div>
          <h1 className="text-2xl font-black text-orange-500 flex items-center gap-2">
            🚽 BañoRank
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Control de Campus Colectivo</p>

          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl font-bold text-sm text-center">
            CNX: 🟢 {online} Conectados
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-gray-700 text-xs uppercase tracking-wider border-b pb-1 mb-2">Comunidad Online</h2>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {usuarios.map((u, i) => (
                <div key={i} className="text-sm flex gap-2 items-center font-semibold text-gray-700 truncate">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: u.color }} />
                  <span>{u.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl font-bold transition-all text-center w-full"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* PANEL CENTRAL: MAPEO UNIVERSITARIO */}
      <div className="flex-1 p-6 overflow-y-auto h-full space-y-6 bg-gray-50/50">
        
        {/* HERO BANNER */}
        <div className="relative h-40 rounded-3xl overflow-hidden shadow-sm">
          <img src="/campus.jpeg" className="w-full h-full object-cover" alt="Campus Universitario" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center p-6">
            <h1 className="text-3xl text-white font-black">Estado de Baños Universitarios</h1>
            <p className="text-orange-100 text-sm mt-1">Reporta e infórmate en vivo sobre las condiciones de limpieza del campus.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ESTRUCTURA EDIFICIOS DE LA A - J */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-gray-800">Estructura por Pabellones (A - J)</h2>
            
            <div className="space-y-6">
              {torres.map((tower) => (
                <div key={tower} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="font-black text-xl text-orange-500 border-b pb-2 mb-4">
                    🏢 Edificio Torre {tower}
                  </h3>
                  
                  <div className="space-y-3">
                    {pisos.map((piso) => {
                      const banosPiso = banosBD.filter(
                        (b) => b.tower.toUpperCase() === tower && b.name.includes(`Piso ${piso}`)
                      );

                      return (
                        <div key={piso} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                          <span className="text-sm font-bold text-gray-500">Piso {piso}</span>
                          <div className="grid grid-cols-2 sm:flex gap-2 mt-1 sm:mt-0">
                            {banosPiso.length === 0 ? (
                              <span className="text-xs text-gray-400 italic">No cargado en BD</span>
                            ) : (
                              banosPiso.map((b) => (
                                <div 
                                  key={b.id} 
                                  className={`text-xs px-2.5 py-1.5 rounded-xl font-bold flex flex-col items-center justify-center min-w-[80px] text-center border ${
                                    b.status === "good" ? "bg-green-50 border-green-200 text-green-700" :
                                    b.status === "average" ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                                    b.status === "bad" ? "bg-red-50 border-red-200 text-red-700" : 
                                    "bg-gray-100 border-gray-200 text-gray-700"
                                  }`}
                                >
                                  <span>{b.name.split("-")[1] || b.name}</span>
                                  <span className="text-[9px] opacity-85 uppercase font-black mt-0.5">({b.status})</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORMULARIO DE REPORTE */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 h-fit lg:sticky lg:top-0">
            <h2 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
              🚨 Enviar Alerta de Estado
            </h2>
            <form onSubmit={enviarReporte} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Seleccionar Baño</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                  value={selectedBathroom}
                  onChange={(e) => setSelectedBathroom(e.target.value)}
                >
                  <option value="">-- Elige un Baño --</option>
                  {banosBD.map((b) => (
                    <option key={b.id} value={b.id}>
                      Torre {b.tower} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Estado en Tiempo Real</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="good">Limpio / Operativo ✨</option>
                  <option value="average">Regular / Sin papel ⚠️</option>
                  <option value="bad">Sucio / Malogrado ❌</option>
                  <option value="closed">Clausurado temporalmente 🚫</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Comentario descriptivo</label>
                <textarea 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs h-16 resize-none text-gray-800"
                  placeholder="Ej: El caño gotea, faltan toallas de papel..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl font-bold text-sm shadow transition-all">
                Subir Alerta
              </button>
            </form>

            {/* HISTORIAL ABAJO DEL FORMULARIO */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Historial Reciente</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {reportes.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No hay registros aún.</p>
                ) : (
                  reportes.map((r, i) => (
                    <div key={i} className="text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                      <div>
                        <span className="font-bold text-orange-600">@{r.user?.username || "Usuario"}</span>: {r.bathroom?.name} (Torre {r.bathroom?.tower}) paso a estado <span className="font-bold text-gray-800">[{r.status}]</span>.
                      </div>
                      {r.comment && <p className="text-gray-500 mt-0.5 italic">"{r.comment}"</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* PANEL DERECHO: CHAT GLOBAL PERSISTENTE EN BLANCO */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-md flex-shrink-0">
        
        {/* Cabecera del Chat */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800">
              Chat del Campus
            </h2>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Mensajes instantáneos de la comunidad</p>
        </div>

        {/* Lista de Mensajes Visibles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-sm">
          {mensajes.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 italic text-center p-4 text-xs">
              El chat está limpio. ¡Escribe un mensaje para comenzar!
            </div>
          ) : (
            mensajes.map((msg) => (
              <div key={msg.id} className="break-words leading-relaxed bg-gray-50 p-2 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 mr-2 font-mono">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </span>
                <span className="font-black mr-1" style={{ color: msg.color }}>
                  {msg.usuario}
                </span>
                <span className="text-gray-400 font-bold">:</span>
                <span className="text-gray-800 ml-1 font-medium">{msg.mensaje}</span>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input con fondo blanco y envío con Enter */}
        <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
          <input
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje aquí..."
            maxLength={150}
          />

          <button
            onClick={enviarMensaje}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 px-3 rounded-xl text-xs transition-colors shadow-sm"
          >
            Enviar
          </button>
        </div>

      </div>

    </div>
  );
}