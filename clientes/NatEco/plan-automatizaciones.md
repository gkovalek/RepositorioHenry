# NatEco — Análisis y Plan de Trabajo (Automatizaciones)

**Pasantía Henry · Equipo de Automatizaciones**
**Preparado para:** Juan y Gerardo (NatEco)
**Reunión propuesta:** viernes 11/09/2026, 15:00 hs
**Fuentes analizadas:** mensaje de WhatsApp de NatEco, documento "Proceso Operativo Pedidos – NatEco" (PDF, 3 páginas), planilla ENTREGAS, planilla INVENTARIO (enero).

---

## 1. Resumen del proceso actual (según el documento del cliente)

1. **Canales de venta:** Instagram y WhatsApp. No tienen WhatsApp Business habilitado para difusión (el número actual no permite listas de difusión). La acción de venta principal es 1 difusión semanal manual con info/promos.
2. **Entrada de pedido y cobro:** el pedido se hace en la tienda web y redirige a WhatsApp; se responde manualmente con mensaje de bienvenida; se comparte manualmente el alias de pago (rotan entre 3 alias internos y alias externos); se verifica manualmente cada comprobante contra Mercado Pago/bancos.
3. **Logística:** entregas martes... miércoles y viernes desde el mediodía. El día previo, se pasan manualmente todos los pedidos del panel de la tienda a la planilla **ENTREGAS**.
4. **Preparación y despacho:** se imprimen los tickets, se cargan manualmente a la planilla **INVENTARIO**, se arma todo en masa por categoría (secos/congelados/cajas) y se avisa el despacho manualmente.
5. **Inventario, finanzas y precios:** stock, cálculo financiero (tabla dinámica con precios de venta/costo + inventario del mes) y actualización de precios se llevan en planillas Excel separadas, 100% manuales.

Todo el proceso es manual y depende de traspasar la misma información entre 3-4 planillas distintas (tienda → ENTREGAS → INVENTARIO → STOCK → precios).

---

## 2. Validación de la necesidad

Cruzando el mensaje de WhatsApp con el propio documento del cliente, la necesidad está **validada y es consistente en ambas fuentes**:

- El cliente decidió **migrar la tienda a un nuevo sistema de gestión** que integre inventario, stock y control — eso ya está resuelto por otra vía (no es tarea nuestra construirlo).
- Ellos mismos separan sus "Puntos clave a automatizar" en dos grupos dentro del PDF:
  - **Puntos 1 a 3** → para trabajar en conjunto con el equipo de automatización.
  - **Puntos 4 y 5** (sincronización de pedidos, actualización de stock y precios) → el propio documento dice textualmente *"los resolveremos con el nuevo sistema de gestión que contrataremos"*.
- El mensaje de WhatsApp confirma lo mismo con otras palabras: *"se centrarán más en las automatizaciones de la atención al cliente/canales de venta, y en pequeñas mejoras de los procesos actuales, pero no tanto en esta parte de la gestión de inventarios"*.

**Conclusión:** el pedido tiene sentido y está bien delimitado. Nuestro foco real es **atención al cliente, canales de venta y pequeñas mejoras operativas** — no la gestión de inventario/stock de fondo, que absorbe el nuevo sistema.

Hay una única tensión a resolver el viernes: el punto 3 del PDF (*"Inventario para armado de pedidos"*, usar IA para volcar los remitos del día a un inventario de armado) el cliente lo escribe como algo que **el nuevo sistema tampoco resuelve** ("esto detectamos que le falta al sistema que vamos a contratar"), pero el mensaje de WhatsApp dice que no quieren que nos enfoquemos "tanto" en inventarios. Hay que confirmar si este punto queda dentro o fuera de nuestro alcance.

---

## 3. Alcance propuesto

### A. Para construir con el equipo de automatización
1. **Difusiones de venta más masivas/automatizadas** (canal principal de venta hoy).
2. **Chatbot de atención al cliente:**
   - Toma de pedidos + respuestas a consultas frecuentes.
   - Estimación automática de día/horario de entrega según la dirección del cliente.
   - Recordatorio automático de entrega el día del reparto (evaluar sumar ubicación en tiempo real).
3. **A confirmar el viernes:**
   - Conciliación automática de pagos (Mercado Pago/bancos) — el propio cliente lo marca como "a definir" por la complejidad de los alias rotativos.
   - Asistente con IA para volcar los remitos de un día de entrega al inventario de armado (punto en tensión, ver sección 2).

### B. Resuelto por el nuevo sistema de gestión (no lo construimos)
- Sincronización de pedidos entre la tienda y la planilla ENTREGAS.
- Actualización centralizada de stock, precios y cálculo de ganancias.

### C. Acompañamiento solicitado (rol de soporte, no de construcción)
- El cliente pidió explícitamente ayuda durante **todo el proceso de migración y ensamblaje** a la nueva tienda/sistema de gestión. Esto lo tomamos como acompañamiento (relevar requisitos, ayudar a probar integraciones, checklist de corte), no como desarrollo propio.

---

## 4. Puntos abiertos para la reunión del viernes

1. ¿El punto "inventario para armado de pedidos" queda en nuestro alcance o lo cubre el nuevo sistema?
2. ¿Ya eligieron el nuevo sistema de gestión? ¿Cuál, y qué integraciones/API ofrece?
3. ¿Hoy cuentan con WhatsApp Business API (Meta Cloud API o un proveedor tipo Twilio/360dialog) o solo la app de WhatsApp Business? Es bloqueante para difusiones masivas y chatbot.
4. Zonas de entrega: ¿existe un mapeo de zonas/horarios para poder estimar día y horario por dirección?
5. Ubicación en tiempo real en el aviso de entrega: ¿el repartidor tiene una app/GPS, o la ubicación se compartiría de forma manual?
6. Conciliación de pagos: ¿cuántas cuentas/alias son en total (3 internos + externos)? ¿tienen o pueden gestionar acceso a la API de Mercado Pago?
7. Volumen: ¿cuántos pedidos aproximados por semana / por día de entrega? (para dimensionar chatbot y armado de pedidos)
8. Las planillas ENTREGAS e INVENTARIO que compartieron llegaron como plantillas vacías (sin datos cargados) — ¿pueden pasarnos una semana real ya completada para entender bien el flujo de datos?
9. Confirmar día/hora de la reunión: viernes 15 hs.

---

## 5. Plan de trabajo por fases

| Fase | Contenido | Cuándo |
|---|---|---|
| **0 — Descubrimiento** | Reunión del viernes, relevar respuestas a los puntos abiertos, pedir planilla real de una semana, mapear zonas de entrega | Esta semana |
| **1 — Chatbot de atención y toma de pedidos** | Diseñar el flujo conversacional (bienvenida, FAQ, estado del pedido, alias de pago vigente), definir canal (WhatsApp Business API) y armar un prototipo | Semanas 1-2 |
| **2 — Difusiones masivas** | Habilitar envío de listas de difusión / campañas segmentadas para el canal principal de venta | Semanas 2-3 |
| **3 — Notificaciones automáticas de entrega** | Aviso automático el día de reparto, horario estimado por zona, evaluar ubicación en tiempo real | Semanas 3-4 |
| **4 — Conciliación de pagos** *(a confirmar)* | Automatizar el cruce de comprobantes contra Mercado Pago/bancos | A definir según punto 6 |
| **5 — Inventario para armado** *(a confirmar)* | Asistente IA para volcar remitos del día de entrega al inventario de armado | A definir según punto 1 |
| **Transversal — Acompañamiento** | Apoyo en la migración al nuevo sistema de gestión: relevar requisitos, probar integraciones, checklist de corte | Durante todo el proyecto |

---

## 6. Riesgos y dependencias detectadas

- **Sin WhatsApp Business API activa**, el chatbot y las difusiones masivas no son viables tal como están hoy — probablemente requiere dar de alta un número con Meta/un proveedor (BSP).
- **Alias de pago rotativos y múltiples cuentas/bancos** complican la conciliación automática si no hay acceso a API (ej. Mercado Pago).
- **Datos con problemas de codificación** en las planillas recibidas (ej. "Casta​ñas", "Garrapi​ñada", "​ñoquis" aparecen con caracteres corruptos) — conviene normalizar al integrar con cualquier sistema nuevo.
- **Planillas de ejemplo vacías:** tanto ENTREGAS como INVENTARIO llegaron sin datos reales cargados, lo que limita el diseño fino de la automatización hasta tener un caso real completo.

---

## 7. Próximos pasos inmediatos

1. Confirmar participación en la reunión del viernes 15 hs.
2. Llevar las preguntas de la sección 4 a la reunión.
3. Pedir al cliente una semana real de las planillas ENTREGAS e INVENTARIO.
4. Con las respuestas, cerrar el alcance definitivo de los puntos 3, 4 y 5 y arrancar la Fase 1.
