# 🥗 Optimeal

### *Planifica mejor. Desperdicia menos.* 🌱

¡Hola! 👋 Este es el prototipo de **Optimeal**, una plataforma para reducir el desperdicio de alimentos en los casinos de colegios de Chile operados por concesionarias.

La idea es simple: **los estudiantes reservan su almuerzo con anticipación** 🍽️ → **el casino sabe exactamente cuántas raciones cocinar** 👩‍🍳 → **la administración mide cuánto se ahorra y cuánto se deja de botar** 📉.

> 🎓 Proyecto para el **Demo Day** del taller universitario.
> ⚠️ Es un **prototipo**: el login no tiene seguridad real y **todos los datos son inventados**.

---

## 📍 ¿En qué fase vamos?

| Fase | Qué incluye | Estado |
|:---:|---|:---:|
| **1** | 🏗️ Estructura, estilo visual, pantalla de Inicio, Login simulado y esqueleto de los 3 paneles | ✅ Lista |
| **2** | 🎓 Panel Estudiantes: menú visual, reserva, contador de cierre, QR y mis reservas | ✅ Lista |
| **3** | 👩‍🍳 Panel Casino: demanda diaria, predicción de raciones y lista de preparación | ✅ Lista |
| **4** | 🏛️ Panel Administración: registro de desperdicio, ahorro y meta, establecimientos | ✅ Lista |
| **5** | ✨ Pulido para el Demo Day: modo presentador, revisión en celular y guion de demo | ⏳ Siguiente |

El detalle de cada fase está más abajo, en la sección **🛣️ Hoja de ruta**.

> 🆕 **¿Ya tenías el proyecto de una fase anterior?** Corre `npm install` otra vez antes de `npm run dev`: en la Fase 2 agregamos una librería nueva (la del código QR). Las fases 3 y 4 no agregan librerías.

---

## 🚀 Cómo correr la página (paso a paso, en Windows)

### 1️⃣ Instala Node.js (solo la primera vez)

Node.js es el programa que nos deja correr la página en tu computador.

1. Entra a 👉 **https://nodejs.org**
2. Descarga la versión que dice **LTS** (la recomendada) e instálala con todo "Siguiente ➡️ Siguiente ➡️ Finalizar".
3. Para comprobar que quedó bien, abre una terminal y escribe:

   ```bash
   node -v
   ```

   Debería mostrar algo como `v22.x.x` o superior. 🎉 (Necesitas **v20.19 o más nueva**).

### 2️⃣ Abre una terminal dentro de la carpeta del proyecto

La forma más fácil:

1. Abre el **Explorador de archivos** 📁 y entra a `Documentos\Optimeal`.
2. Haz clic en la **barra de dirección** (arriba, donde sale la ruta), escribe `cmd` y presiona **Enter**.
3. Se abrirá una ventana negra ya ubicada en la carpeta. ✨

> 💡 Si usas **VS Code**: abre la carpeta y luego ve a *Terminal → Nueva terminal*.

### 3️⃣ Instala las dependencias (la primera vez y cada vez que cambie `package.json`)

```bash
npm install
```

Esto descarga las "piezas" que usa el proyecto (React, Tailwind, etc.) y crea la carpeta `node_modules`. Toma más o menos un minuto ☕.

### 4️⃣ ¡Enciende la página! 🔥

```bash
npm run dev
```

Se abrirá solita en tu navegador en 👉 **http://localhost:5173**

> ⚠️ Ábrela siempre desde esa dirección. Si haces doble clic en `index.html`, la página **no** funciona (verás un aviso explicándolo).

Mientras la terminal esté abierta, cada vez que guardes un cambio en el código la página se actualiza al instante. ⚡

### 5️⃣ Para apagarla

En la terminal, presiona **`Ctrl + C`**. 🛑

---

## 🎤 Tips para el Demo Day

- 📶 **Funciona sin internet**: después del `npm install`, todo (incluso las fuentes) queda en tu computador.
- 🏎️ **Versión "final" más rápida**: en vez de `npm run dev`, puedes usar:

  ```bash
  npm run build
  npm run preview
  ```

  y abrir 👉 **http://localhost:4173**
- 🔄 **Reiniciar la demo**: al final de la página de Inicio hay un botón **"Reiniciar demo"** que borra las sesiones y datos guardados, para partir de cero frente al jurado.
- 🪄 **Entrar rápido**: en cada login está el botón **"Usar cuenta de demostración"**, que rellena el correo y la contraseña por ti.
- 🔀 **Saltar entre áreas**: puedes tener las 3 sesiones abiertas a la vez (Estudiante, Casino y Administración) y moverte entre ellas sin volver a iniciar sesión.
- 🎬 **Controles de demo**: en la pantalla de confirmación hay botones para **simular la hora** ("Faltan 10 segundos", "Plazo cerrado"). Así muestras en vivo cómo se cierra el plazo sin esperar hasta las 10:00. Mientras la hora esté simulada, verás una franja amarilla arriba con el botón **"Volver a la hora real"**.
- 📱 **El QR se puede escanear**: apúntalo con la cámara del celular y verás los datos de la reserva. ¡Efecto wow asegurado! ✨
- 🔴 **Demo "en vivo" con dos pestañas**: abre el **Panel del Casino** en una pestaña y el **Área Estudiantes** en otra. Cuando el estudiante reserva, la demanda del casino sube al instante (mira el indicador *"En vivo · N desde la app"*).

---

## 🎓 Panel Estudiantes: recorrido sugerido (Fase 2)

1. 🔑 Entra al **Área Estudiantes** con "Usar cuenta de demostración".
2. 📅 En **Menú y reserva**, elige un día en el selector de fecha. Cada día muestra su estado: **abierto** (punto verde), **reservado** (✓) o **cerrado** (🔒).
3. 🍽️ Revisa las 3 tarjetas (Tradicional, Vegetariano y Liviano), con su plato, ingredientes y acompañamientos. Presiona **"Seleccionar menú"** en una.
4. ➡️ Presiona **"Reservar almuerzo"** en la barra de abajo.
5. ⏳ En el **contador de cierre** ves la fecha, el menú, el tiempo restante y la hora límite. Presiona **"Confirmar reserva"**.
6. ✅ Aparece la **confirmación con el código QR** y cómo retirar el almuerzo.
7. 🗓️ En **Mis reservas** puedes **modificar** o **cancelar** (con una ventana de confirmación). La reserva de **hoy** aparece como *"Lista para retirar"*: como el plazo ya cerró, sus botones están bloqueados 🔒 y se explica por qué.
8. 🎬 Vuelve a una reserva abierta, entra a confirmar y usa **"Faltan 10 segundos"** para ver cómo el contador llega a cero y la pantalla cambia sola a **"Plazo cerrado"**.

> 🧪 La primera vez que entra un estudiante, la app le crea algunas **reservas de ejemplo** (pasadas, de hoy y futuras) para que haya algo que mostrar.

---

## 👩‍🍳 Panel del Casino: recorrido sugerido (Fase 3)

1. 🔑 Entra al **Panel del Casino** con "Usar cuenta de demostración" (queda en *Liceo A21*).
2. 📊 **Demanda diaria**: total de reservas, reservas por menú y el **gráfico de la semana**.
   - Pasa el mouse sobre una columna para ver el detalle, o toca **"Ver datos en tabla"**.
   - Los días con reservas abiertas muestran un **contorno punteado**: es lo que se *estima* al cierre.
   - La **línea roja punteada** es lo que se cocinaba **antes de Optimeal** (raciones fijas). ¡Ahí se ve el ahorro! 💚
3. 🔮 **Predicción de raciones**: cada menú muestra sus **factores** (reservas confirmadas, reservas por llegar, estudiantes que no retiran, margen) y el **historial** usado.
   - 🟢 *Dato confirmado* (borde sólido) vs. 🔵 *Estimación* (borde punteado): nunca se confunden.
   - Hoy jueves, la **Tortilla de verduras** es un plato nuevo → **"Datos insuficientes"**.
   - Cambia el colegio a **Colegio María Inmaculada** (lleva 1 semana en el piloto) → todo queda en **"Datos insuficientes"**.
4. 📋 **Lista de preparación**: raciones e ingredientes con sus cantidades. Si falta un gramaje dice **"Cantidad por definir"** (no inventamos números). Prueba **"Imprimir lista"** 🖨️.

---

## 🏛️ Panel Administración: recorrido sugerido (Fase 4)

1. 🔑 Entra al **Área Administrativa** con "Usar cuenta de demostración".
2. 🗑️ **Registro de desperdicio**: elige fecha y menú, anota raciones preparadas/servidas (opcionales), **kilos sobrantes** y observaciones.
   - A la derecha ves **Estimado vs. observado**: lo que dijo la predicción, las reservas, y lo que tú ingresas.
   - Presiona **"Guardar registro"**: aparece la confirmación y el dato queda **marcado como ✨ Nuevo** en el resumen de la semana.
   - Los días sin registro aparecen como **"Dato faltante"** 🟡.
3. 💚 **Ahorro y reducción**: costo **estimado** vs. **real**, la **diferencia**, el **ahorro frente a antes de Optimeal**, la **evolución de los kilos** y la **meta de reducción** con su barra de progreso (puedes cambiar la meta).
   - Todo dice claramente que es un **ejemplo ficticio**, y las facturas pendientes y registros faltantes se marcan.
4. 🏫 **Establecimientos**: los 4 colegios con sus propios indicadores. Presiona **"Usar como activo"** para cambiar el colegio que ven los paneles (o **"Ver ahorro"** para saltar directo).
   - Prueba **Colegio María Inmaculada**: como lleva 1 semana, su meta muestra **"Datos insuficientes"**.

### 🧮 ¿Cómo se calculan el desperdicio y el ahorro?

- **Kilos desperdiciados** = raciones que sobraron × 0,38 kg + restos que quedan en las bandejas (≈ 0,08 kg por ración servida).
- **Antes de Optimeal** se cocinaba un número **fijo** de raciones al día (por ejemplo, 470 en el Liceo A21). Eso es la **línea base**.
- **Ahorro** = (raciones fijas de antes − raciones preparadas con Optimeal) × costo por ración.
- **Costo estimado** = raciones que recomendó la predicción × costo por ración. **Costo real** = lo que dicen las facturas (algunas semanas aún no llegan: *dato faltante*).
- **Reducción actual** = cuánto bajaron los kilos por día (promedio de las 2 últimas semanas) frente a la línea base.

> 💡 Las cifras de la portada (*"−43 % kilos desperdiciados"*, *"ahorro mensual estimado"*) se calculan con estos mismos datos, así todo cuadra en la demo.

### 🔮 ¿Cómo se calcula la predicción?

```text
Raciones recomendadas = Reservas confirmadas          (dato real)
                      + Reservas que aún pueden llegar (si el plazo sigue abierto)
                      − Estudiantes que no retiran     (promedio del historial)
                      + Margen de seguridad            (2 %, mínimo 2 raciones)
```

Si el casino tiene **menos de 3 semanas de historial**, o el plato es **nuevo**, no se estima: se muestra **"Datos insuficientes"** y se usan solo las reservas confirmadas.

### 📏 Reglas del servicio (ficticias)

| Regla | Valor | Dónde cambiarla |
|---|---|---|
| ⏰ Hora límite para reservar, modificar o cancelar | **10:00 h** del mismo día | `src/data/config.js` |
| 📆 Días que se pueden reservar | Lunes a viernes, esta semana y la próxima | `src/data/config.js` |
| 🍽️ Horario de retiro | **13:00 – 14:30 h** | `src/data/config.js` |
| 🥘 Menús | Ciclo semanal con 3 opciones por día | `src/data/menus.js` |
| 📋 Fichas técnicas (gramos por ración) | Por plato | `src/data/recetas.js` |
| 📈 Historial mínimo para estimar | 3 semanas | `SEMANAS_MINIMAS` en `src/utils/prediccion.js` |
| 💲 Costo por ración | $2.280 a $2.600 según el colegio | `costoRacion` en `src/data/establecimientos.js` |
| ⚖️ Kilos por ración y restos por bandeja | 0,38 kg y 0,08 kg | `src/data/desperdicio.js` |
| 🎯 Meta de reducción por defecto | 50 % | `META_POR_DEFECTO` en `src/context/RegistrosContext.jsx` |

---

## 🔑 ¿Cómo funciona el login "de mentira"?

- Pide **correo** y **contraseña**, como un login real. ✉️🔒
- **Cualquier correo con formato válido** (por ejemplo `como@algo.com`) y **cualquier contraseña** te dejan entrar. ✅
- Si dejas algo vacío o el correo no tiene `@`, muestra un mensaje amable de error (para que se vea realista 😉).
- El nombre del usuario se "adivina" a partir del correo: `sofia.rojas@colegio.cl` → **Sofia Rojas**.
- La sesión se guarda en el navegador (`localStorage`), así que si recargas la página sigues dentro.

---

## 🗂️ ¿Qué hay en cada carpeta?

```text
Optimeal/
├── 📄 index.html              → La "cáscara" HTML donde se monta la app
├── 📄 package.json            → Lista de dependencias y comandos (dev, build, preview)
├── 📄 vite.config.js          → Configuración de Vite (React + Tailwind)
├── 📁 public/
│   └── favicon.svg            → El iconito de la pestaña 🌿
└── 📁 src/
    ├── main.jsx               → Punto de partida: fuentes, estilos, router y contextos
    ├── App.jsx                → 🗺️ Mapa de rutas (qué pantalla va en qué URL)
    ├── index.css              → 🎨 Colores, fuentes y sombras del proyecto
    ├── 📁 context/            → 🧠 Información compartida por toda la app
    │   ├── SesionContext.jsx  → 🔐 La sesión simulada (quién entró a qué área)
    │   ├── ReservasContext.jsx→ 🧾 Las reservas de almuerzo (crear, modificar, cancelar)
    │   ├── RegistrosContext.jsx → 🗑️ Registros de desperdicio guardados y metas de cada colegio
    │   ├── RelojContext.jsx   → 🕒 La hora de la app (real o simulada para la demo)
    │   └── AvisosContext.jsx  → 🔔 Mensajitos flotantes ("¡Reserva confirmada!")
    ├── 📁 data/               → 📦 Datos inventados y configuración
    │   ├── areas.js           → Las 3 áreas: nombre, color, menú lateral y fase de cada pantalla
    │   ├── config.js          → ⚙️ Reglas: hora de cierre, horario de retiro…
    │   ├── menus.js           → 🍲 Menús de la semana (platos, ingredientes, ilustración)
    │   ├── recetas.js         → 📋 Fichas técnicas: gramos por ración de cada ingrediente
    │   ├── demanda.js         → 📊 Simulación de reservas e historial de cada casino
    │   ├── desperdicio.js     → 🗑️ Kilos, costos, línea base "antes de Optimeal" y datos faltantes
    │   └── establecimientos.js→ Colegios y casinos ficticios
    ├── 📁 components/         → 🧱 Piezas reutilizables
    │   ├── ui/                → Boton, Campo, Tarjeta, Insignia, Dialogo, Encabezado
    │   ├── layout/            → Estructura de los paneles (menú lateral, barra superior…)
    │   ├── estudiantes/       → Tarjeta de menú, selector de fecha, cuenta regresiva…
    │   ├── casino/            → Gráfico semanal, encabezado con fechas, etiquetas Confirmado/Estimación
    │   ├── admin/             → Gráfico de kilos desperdiciados y la "píldora" del colegio activo
    │   ├── reloj/             → Controles de demo y franja de "hora simulada" 🎬
    │   ├── ilustraciones/     → Plato.jsx: los platos dibujados en SVG 🍽️
    │   ├── RescateErrores.jsx → 🛟 Si algo falla, muestra el error en vez de una página en blanco
    │   ├── Logo.jsx           → Logo de Optimeal
    │   └── RequiereSesion.jsx → "Guardia" que manda al login si no has entrado
    ├── 📁 pages/              → 📱 Pantallas completas
    │   ├── Inicio.jsx         → Inicio y acceso a las 3 áreas
    │   ├── Login.jsx          → Login simulado
    │   ├── 📁 estudiantes/    → 🎓 Panel Estudiantes (Fase 2)
    │   │   ├── MenuReserva.jsx    → Agrupa los 2 pasos de "Menú y reserva"
    │   │   ├── MenuVisual.jsx     → Selector de fecha + tarjetas de menú
    │   │   ├── ContadorCierre.jsx → Cuenta regresiva y "Confirmar reserva"
    │   │   ├── ConfirmacionQR.jsx → Reserva confirmada + código QR
    │   │   └── MisReservas.jsx    → Modificar y cancelar reservas
    │   ├── 📁 casino/         → 👩‍🍳 Panel del Casino (Fase 3)
    │   │   ├── DemandaDiaria.jsx    → Indicadores, gráfico semanal y reservas por menú
    │   │   ├── Prediccion.jsx       → Raciones estimadas, factores e historial
    │   │   └── ListaPreparacion.jsx → Ingredientes y cantidades (imprimible)
    │   ├── 📁 admin/          → 🏛️ Panel Administración (Fase 4)
    │   │   ├── RegistroDesperdicio.jsx → Formulario, estimado vs. observado y resumen
    │   │   ├── AhorroReduccion.jsx     → Costos, ahorro, kilos, evolución y meta
    │   │   └── Establecimientos.jsx    → Colegios, sus indicadores y el activo
    │   ├── Proximamente.jsx   → Vista temporal de pantallas aún en construcción 🚧
    │   └── NoEncontrado.jsx   → Página 404
    ├── 📁 hooks/
    │   ├── useCasino.js       → 🧑‍🍳 Junta fecha, colegio, demanda y predicción para el casino
    │   └── useAdmin.js        → 🏛️ Junta colegio, semanas, indicadores y meta para administración
    └── 📁 utils/              → 🧰 Ayudantes (fechas, predicción, formatos de números, guardar en el navegador)
```

> 🙈 La carpeta `node_modules` aparece después del `npm install`. **No hay que tocarla** ni subirla a ningún lado.

---

## 🧠 ¿Cómo funciona el código? (versión amistosa)

### ⚛️ React = piezas de Lego

La página está hecha de **componentes**: piezas pequeñas que se combinan. Por ejemplo, `<Boton>` se usa en todos lados, así que si cambias su estilo, cambia en toda la app. Cada archivo `.jsx` es una pieza o una pantalla.

### 🗺️ Rutas (React Router)

`App.jsx` decide qué pantalla mostrar según la dirección:

| Dirección | Pantalla |
|---|---|
| `/#/` | 🏠 Inicio |
| `/#/login/estudiantes` · `/#/login/casino` · `/#/login/admin` | 🔑 Login de cada área |
| `/#/estudiantes/...` | 🎓 Panel Estudiantes |
| `/#/casino/...` | 👩‍🍳 Panel del Casino |
| `/#/admin/...` | 🏛️ Panel Administrativo |

> 🤔 *¿Por qué hay un `#` en la dirección?* Usamos `HashRouter`, que hace que las rutas funcionen incluso con la versión compilada y sin configurar ningún servidor. Ideal para un prototipo.

### 📋 `areas.js` = el "cerebro" de la navegación

En vez de escribir tres menús a mano, `src/data/areas.js` describe cada área (nombre, ícono, color, pantallas). Los menús laterales, las tarjetas del Inicio y las rutas **se generan solos** a partir de ese archivo. 🪄

Cada pantalla tiene una `fase`. Mientras no la construyamos, se muestra la vista **🚧 Próximamente** con lo que incluirá.

### 🧩 Cómo se "enchufa" una pantalla nueva

Cuando construimos una pantalla, solo hay que registrarla en `PANTALLAS` dentro de `App.jsx` (así se enchufaron las de la Fase 2):

```jsx
const PANTALLAS = {
  'estudiantes/menu': MenuReserva, // 👈 reemplaza automáticamente al "Próximamente"
  'estudiantes/reservas': MisReservas,
  'estudiantes/qr': ConfirmacionQR,
}
```

### 🔐 La sesión (Context)

`SesionContext.jsx` guarda **quién entró a cada área** y **qué colegio está activo**. Cualquier pantalla puede preguntar por esa información con `useSesion()`. Se guarda en el navegador para que no se pierda al recargar.

### 🧾 Las reservas (`ReservasContext.jsx`)

Cada reserva guarda: **quién** (correo), **qué día**, **qué menú**, un **código** (ej. `OPT-7F3K2`) y si está **confirmada** o **cancelada**. El estado que ve el estudiante se calcula según la hora:

| Estado | Cuándo |
|---|---|
| 🟢 **Confirmada** | Antes de la hora límite → se puede modificar o cancelar |
| 🟡 **Lista para retirar** | Ya pasó la hora límite del día → acciones bloqueadas 🔒 |
| ⚪ **Retirada** | El día ya pasó |
| 🔴 **Cancelada** | El estudiante la canceló a tiempo |

Si el estudiante reserva un día donde ya tenía reserva, **no se duplica**: se modifica la existente.

### 🕒 La hora de la app (`RelojContext.jsx`)

Las pantallas no usan la hora del computador directamente, sino `useAhora()`. Normalmente es la hora real, pero los **controles de demo** pueden "adelantar el reloj" para mostrar el cierre del plazo en vivo. 🎬

### 🛟 Pantalla de rescate (`RescateErrores.jsx`)

Si alguna pantalla falla, en vez de quedar **en blanco** aparece un mensaje con el error y los botones **"Reintentar"** y **"Reiniciar demo"**. Así nunca te quedas sin nada frente al jurado, y si pasa algo sabemos exactamente qué fue.

### 📊 ¿De dónde salen los números del casino? (`demanda.js`)

Como el prototipo no tiene cientos de estudiantes reales, **simulamos** las reservas de cada colegio con fórmulas que siempre dan el mismo resultado (no cambian al recargar). Encima se suman las **reservas reales** hechas desde el Área Estudiantes de esta misma app 🔴. Mientras el plazo está abierto, las reservas simuladas van "llegando" a medida que se acerca la hora de cierre.

### 🏫 Datos separados por establecimiento

En los paneles de **Casino** y **Administración** hay un selector arriba a la derecha 🔽. Al cambiar de colegio, las pantallas muestran solo los datos de ese colegio. Los **estudiantes** eligen su colegio al iniciar sesión.

### 🎨 Tailwind CSS = estilos con clases

En vez de escribir CSS aparte, los estilos van como clases en cada elemento: `bg-verde-600` (fondo verde), `rounded-2xl` (bordes redondeados), `p-6` (espacio interior). Los colores propios del proyecto se definen en `src/index.css`.

---

## 🎨 Estilo visual: *Soft UI accesible*

Bordes redondeados, sombras suaves, mucho aire y buen contraste para que todo se lea fácil. 🤍💚

| Nombre | Uso | Color |
|---|---|---|
| 🤍 `marfil` | Fondos y superficies | `#FBF8F1` |
| 💚 `verde` | Color principal, botones | `#2F6B4F` |
| 🍯 `miel` | Plazos, avisos, área Casino | `#D99A2B` |
| 🌊 `laguna` | Área Administración | `#2E6E73` |
| 🧱 `arcilla` | Errores y acciones peligrosas | `#B4443A` |
| 🖋️ `tinta` | Texto | `#1E2A23` |

**Tipografías:** *Fraunces* (títulos, con un toque cálido) y *Plus Jakarta Sans* (todo lo demás).

**Accesibilidad ♿:** foco visible al navegar con teclado (`Tab`), etiquetas en todos los campos, mensajes de error leídos por lectores de pantalla, contraste suficiente y respeto por quienes prefieren menos animaciones.

---

## ✏️ Cambios rápidos que puedes hacer tú

| Quiero… | Ve a… |
|---|---|
| 🏫 Agregar o cambiar un colegio | `src/data/establecimientos.js` |
| 📝 Cambiar textos del Inicio | `src/pages/Inicio.jsx` |
| 🎨 Ajustar un color | `src/index.css` (sección `@theme`) |
| 📋 Cambiar nombres del menú lateral | `src/data/areas.js` |
| 📧 Cambiar los correos de demostración | `correoDemo` en `src/data/areas.js` |
| 🍲 Cambiar un plato del menú | `src/data/menus.js` |
| ⏰ Cambiar la hora límite de reserva | `HORA_CIERRE` en `src/data/config.js` |

---

## 🛣️ Hoja de ruta

### ✅ Fase 1 — Cimientos
- [x] Proyecto React + Vite + Tailwind
- [x] Sistema visual marfil + verde (botones, campos, tarjetas, insignias, logo)
- [x] 🏠 Inicio y acceso con "Planifica mejor. Desperdicia menos."
- [x] 🔑 Login simulado para cada área (cualquier dato sirve)
- [x] 🧩 Estructura de los 3 paneles: menú lateral, selector de colegio, cerrar sesión
- [x] 🚧 Vistas "Próximamente" que explican cada pantalla futura

### ✅ Fase 2 — Panel Estudiantes 🎓
- [x] Menús ficticios de la semana (15 platos chilenos) con ingredientes, acompañamientos e ilustraciones propias
- [x] **Menú visual y reserva**: selector de fecha, "Seleccionar menú", "Reservar almuerzo" y estado de la reserva
- [x] **Contador de cierre**: tiempo restante, hora límite, "Confirmar reserva" y vista de plazo cerrado
- [x] **Confirmación y QR**: QR escaneable, cómo retirar, "Ver mi reserva" y "Modificar reserva"
- [x] **Mis reservas**: modificar/cancelar dentro del plazo (con confirmación) y acciones bloqueadas con explicación después del cierre
- [x] 🎬 Controles de demo para simular la hora
- [x] 🛟 Pantalla de rescate ante errores

### ✅ Fase 3 — Panel del Casino 👩‍🍳
- [x] **Demanda diaria**: total y reservas por menú + gráfico semanal (conectado en vivo a las reservas de la Fase 2)
- [x] **Predicción de raciones**: reservas + historial, factores explicativos y aviso de "Datos insuficientes"
- [x] **Lista de preparación**: ingredientes por receta, "Cantidad por definir" cuando falten datos, "Consultar demanda" e "Imprimir lista"
- [x] 🎨 Colores del gráfico validados para personas con daltonismo + vista en tabla
- [x] 🔄 Sincronización entre pestañas (estudiante ↔ casino)

### ✅ Fase 4 — Panel Administración 🏛️
- [x] **Registro de desperdicio**: formulario, estimado vs. observado, "Guardar registro" y el dato marcado en el resumen de la semana
- [x] **Ahorro y reducción**: costos estimados vs. reales y su diferencia, ahorro vs. antes, kilos y su evolución, meta con barra de progreso
- [x] Ejemplos ficticios y **datos faltantes** (registros y facturas) siempre identificados
- [x] **Gestión de establecimientos**: lista de colegios/casinos con sus indicadores y selector del activo
- [x] Cifras de la portada calculadas con los mismos datos

### ⏳ Fase 5 — Pulido para el Demo Day ✨
- [ ] Modo presentador ampliado (atajos para saltar entre pantallas y reiniciar datos)
- [ ] Revisión en celular y accesibilidad
- [ ] Guion sugerido para la demo 🎬

---

## 🆘 Problemas comunes

<details>
<summary>❌ <b>"npm" no se reconoce como un comando…</b></summary>

Node.js no quedó instalado o la terminal se abrió antes de instalarlo. Instálalo desde https://nodejs.org, **cierra la terminal y ábrela de nuevo**.
</details>

<details>
<summary>❌ <b>PowerShell dice "la ejecución de scripts está deshabilitada"</b></summary>

Usa **cmd** (Símbolo del sistema) en vez de PowerShell, o ejecuta una vez en PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
</details>

<details>
<summary>❌ <b>El puerto 5173 ya está en uso</b></summary>

Probablemente ya tienes la página corriendo en otra terminal. Ciérrala con `Ctrl + C`, o usa la dirección nueva que Vite te muestre (por ejemplo `http://localhost:5174`).
</details>

<details>
<summary>❌ <b>La página sale en blanco o muestra "Ups, algo falló"</b></summary>

1. Revisa que la abriste desde **http://localhost:5173** (con `npm run dev` corriendo) y no con doble clic en `index.html`.
2. Si sale la pantalla **"Ups, algo falló"**, presiona **"Copiar el error"** y compártelo para arreglarlo. 🛟
3. Prueba **"Reiniciar demo"** (borra los datos guardados en el navegador).
4. Si sigue en blanco: presiona **F12**, ve a la pestaña **Console** y saca una captura de los mensajes en rojo. También revisa la terminal donde corre `npm run dev`.
5. Algunas extensiones del navegador (traductores automáticos, bloqueadores) pueden romper la página: prueba en una **ventana de incógnito**.
</details>

<details>
<summary>🔄 <b>Quiero borrar todo y partir de cero</b></summary>

Usa el botón **"Reiniciar demo"** al final de la página de Inicio. 🧹
</details>

---

## 🧰 Tecnologías

- ⚛️ **React 19** — la interfaz
- ⚡ **Vite 8** — el "motor" que corre y compila la página
- 🎨 **Tailwind CSS 4** — los estilos
- 🧭 **React Router 7** — la navegación entre pantallas
- ✨ **Lucide** — los íconos
- 📱 **qrcode.react** — el código QR de retiro

---

Hecho con 💚 para reducir el desperdicio de comida en los colegios de Chile. 🇨🇱
