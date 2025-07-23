import { useEffect, useState } from "react";

export default function PartidoUdeChile() {
  const [racha, setRacha] = useState([]);
  const [proximo, setProximo] = useState(null);

  useEffect(() => {
    fetch("https://api.sofascore.com/api/v1/team/3161/events/last/0")
      .then((res) => res.json())
      .then((data) => {
        const partidosOrdenados = data.events.sort(
          (a, b) => b.startTimestamp - a.startTimestamp
        );

        const ultimos5 = partidosOrdenados.slice(0, 5).map((match) => {
          const esLocal = match.homeTeam.id === 3161;
          const golesLocal = match.homeScore.current ?? 0;
          const golesVisitante = match.awayScore.current ?? 0;

          let resultado;
          if (golesLocal === golesVisitante) {
            resultado = "E";
          } else {
            const gano =
              (esLocal && golesLocal > golesVisitante) ||
              (!esLocal && golesVisitante > golesLocal);
            resultado = gano ? "V" : "D";
          }

          // Resultado con marcador
          return `${resultado}(${golesLocal}-${golesVisitante})`;
        });

        setRacha(ultimos5.reverse());
      });

    fetch("https://api.sofascore.com/api/v1/team/3161/events/next/0")
      .then((res) => res.json())
      .then((data) => {
        if (!data.events || data.events.length === 0) {
          setProximo(null);
          return;
        }
        const partido = data.events[0];
        setProximo({
          local: partido.homeTeam.name,
          visitante: partido.awayTeam.name,
          fecha: partido.startTimestamp * 1000, // convertir a ms
        });
      });
  }, []);

  const formatoFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-CL", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long",
    });
  };

  // Darle color al resultado
  const colorResultado = (r) => {
    if (r.startsWith("V")) return "green";
    if (r.startsWith("D")) return "red";
    if (r.startsWith("E")) return "gray";
    return "black";
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
        maxWidth: "320px",
        margin: "50px auto",
        background: "#f4f4f4",
        color: "black",
      }}
    >
      <h2>Últimos 5 partidos</h2>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
        {racha.length > 0
          ? racha.map((r, i) => (
              <span
                key={i}
                style={{
                  color: colorResultado(r),
                  marginRight: i < racha.length - 1 ? 8 : 0,
                  fontFamily: "monospace",
                }}
              >
                {r}
              </span>
            ))
          : "Cargando..."}
      </p>

      {proximo ? (
        <div style={{ marginTop: "20px" }}>
          <h3>Próximo partido:</h3>
          <p style={{ fontSize: "18px" }}>
            {proximo.local} vs {proximo.visitante}
          </p>
          <p>{formatoFecha(proximo.fecha)}</p>
        </div>
      ) : (
        <p style={{ marginTop: "20px" }}>Cargando próximo partido...</p>
      )}
    </div>
  );
}