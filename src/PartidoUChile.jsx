import { useEffect, useState } from "react";

export default function PartidoUdeChile() {
    const [racha, setRacha] = useState([]);
    const [proximo, setProximo] = useState(null);


    useEffect(() =>{
        //datos simulados
        const ultimosResultados = ["V", "V", "E", "V", "D"];
        const siguientePartido = {
            local : "Universidad de Chile",
            visitante: "Coquimbo unido",
            fecha : "2025-07-24T18:00:00Z"
        };

        setRacha(ultimosResultados);
        setProximo(siguientePartido);
    }, []);

    const formatoFecha = (fechaISO) =>{
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString( "es-CL", {
            weekday : "long",
            hour : "2-digit",
            minute : "2-digit"
        });
    };

    return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "10px", 
      padding: "20px", 
      textAlign: "center", 
      maxWidth: "300px",
      margin: "50px auto",
      background: "#f4f4f4",
      color : 'black' 
    }}>
      <h2>Últimos 5 partidos</h2>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{racha.join(" - ")}</p>

      {proximo && (
        <div style={{ marginTop: "20px" }}>
          <h3>Próximo partido:</h3>
          <p style={{ fontSize: "18px" }}>
            {proximo.local} vs {proximo.visitante}
          </p>
          <p>{formatoFecha(proximo.fecha)}</p>
        </div>
      )}
    </div>
  );
}
