// src/config.ts
var CARD_TYPE = "soft-room-card";
var CARD_NAME = "Soft Room Card";
var CARD_VERSION = "2.1.0";
var TOGGLE_DOMAINS = /* @__PURE__ */ new Set([
  "automation",
  "cover",
  "fan",
  "group",
  "humidifier",
  "input_boolean",
  "light",
  "lock",
  "media_player",
  "remote",
  "scene",
  "script",
  "switch",
  "vacuum"
]);
var DEFAULT_ACTION = {
  action: "toggle"
};
var DEFAULT_ITEM = {
  entity: ""
};
var DEFAULT_ROOM = {
  title: "Ph\xF2ng kh\xE1ch",
  accent_color: "#eb3e7c",
  layout: void 0,
  columns: void 0,
  tile_width: void 0,
  tile_height: void 0,
  items: []
};
var DEFAULT_CONFIG = {
  type: `custom:${CARD_TYPE}`,
  theme: "pastel",
  room_display: "tabs",
  layout: "scroll",
  columns: 4,
  tile_width: 160,
  tile_height: 160,
  secondary_info: "last-changed",
  background: "#f5c7b7",
  surface_color: "#f6d5d0",
  border_color: "rgba(255, 255, 255, 0.48)",
  accent_color: void 0,
  text_color: void 0,
  muted_text_color: void 0,
  state_text_color: void 0,
  tab_background_color: "rgba(255, 255, 255, 0.14)",
  rooms: []
};
var THEME_PRESETS = {
  pastel: {
    background: "#f5c7b7",
    surface: "#f6d5d0",
    border: "rgba(255, 255, 255, 0.48)",
    text: "#221f24",
    mutedText: "#5a5054",
    stateText: "#555762",
    accent: "#eb3e7c"
  },
  warm: {
    background: "#f6d3bd",
    surface: "#f4dcc8",
    border: "rgba(255, 255, 255, 0.42)",
    text: "#2a241f",
    mutedText: "#7b7067",
    stateText: "#605856",
    accent: "#d76334"
  },
  neutral: {
    background: "#dfe4e7",
    surface: "#edf1f3",
    border: "rgba(255, 255, 255, 0.5)",
    text: "#1f2428",
    mutedText: "#62707b",
    stateText: "#4f5a62",
    accent: "#506c86"
  }
};
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
function getEntityDomain(entityId = "") {
  return entityId.includes(".") ? entityId.split(".")[0] : "";
}
function normalizeConfig(config) {
  const next = {
    ...deepClone(DEFAULT_CONFIG),
    ...config ? deepClone(config) : {}
  };
  if ((!next.rooms || !next.rooms.length) && Array.isArray(next.entities)) {
    next.rooms = [
      {
        ...deepClone(DEFAULT_ROOM),
        items: next.entities
      }
    ];
  }
  next.rooms = (next.rooms || []).map((room) => ({
    ...deepClone(DEFAULT_ROOM),
    ...room,
    items: ((room.items && room.items.length ? room.items : room.entities) || []).map((item) => normalizeItem(item))
  }));
  return next;
}
function normalizeItem(item) {
  const next = {
    ...deepClone(DEFAULT_ITEM),
    ...item ? deepClone(item) : {}
  };
  if (next.tap_action) {
    next.tap_action = normalizeAction(next.tap_action);
  }
  if (next.hold_action) {
    next.hold_action = normalizeAction(next.hold_action);
  }
  if (next.double_tap_action) {
    next.double_tap_action = normalizeAction(next.double_tap_action);
  }
  return next;
}
function normalizeAction(action) {
  return {
    ...deepClone(DEFAULT_ACTION),
    ...action ? deepClone(action) : {}
  };
}
function createStubConfig() {
  return normalizeConfig({
    ...DEFAULT_CONFIG,
    rooms: [
      {
        ...DEFAULT_ROOM,
        items: [
          {
            entity: "light.phong_khach",
            name: "\u0110\xE8n ph\xF2ng kh\xE1ch",
            icon: "mdi:ceiling-light"
          },
          {
            entity: "light.den_hat",
            name: "\u0110\xE8n h\u1EAFt ph\xF2ng",
            icon: "mdi:track-light"
          },
          {
            entity: "binary_sensor.chan_cua",
            name: "Ch\xE2n c\u1EEDa",
            icon: "mdi:foot-print",
            tap_action: {
              action: "more-info"
            }
          },
          {
            entity: "light.den_cua",
            name: "\u0110\xE8n c\u1EEDa",
            icon: "mdi:coach-lamp"
          }
        ]
      }
    ]
  });
}
function resolveTheme(config) {
  const preset = config.theme && config.theme !== "custom" ? THEME_PRESETS[config.theme] : THEME_PRESETS.pastel;
  return {
    background: config.background || preset.background,
    surface: config.surface_color || preset.surface,
    border: config.border_color || preset.border,
    tabBackground: config.tab_background_color || "rgba(255, 235, 233, 0.42)",
    text: config.text_color || preset.text,
    mutedText: config.muted_text_color || preset.mutedText,
    stateText: config.state_text_color || preset.stateText,
    accent: config.accent_color || preset.accent
  };
}
function ensureRoom(room) {
  return {
    ...deepClone(DEFAULT_ROOM),
    ...room ? deepClone(room) : {},
    items: room?.items ? room.items.map((item) => normalizeItem(item)) : []
  };
}
function ensureItem(item) {
  return normalizeItem(item);
}
function cleanConfig(config) {
  const next = deepClone(config);
  next.room_display = config.room_display || "tabs";
  next.rooms = next.rooms.map((room) => {
    const cleanedRoom = {
      title: room.title || DEFAULT_ROOM.title,
      accent_color: room.accent_color || void 0,
      layout: room.layout || void 0,
      columns: room.columns || void 0,
      tile_width: room.tile_width || void 0,
      tile_height: room.tile_height || void 0,
      items: room.items.map((item) => cleanItem(item))
    };
    return cleanedRoom;
  });
  return next;
}
function cleanItem(item) {
  const cleaned = {
    entity: item.entity
  };
  if (item.name) {
    cleaned.name = item.name;
  }
  if (item.icon) {
    cleaned.icon = item.icon;
  }
  if (item.secondary_info) {
    cleaned.secondary_info = item.secondary_info;
  }
  for (const key of ["tap_action", "hold_action", "double_tap_action"]) {
    const action = item[key];
    if (!action) {
      continue;
    }
    const cleanedAction = cleanAction(action);
    if (cleanedAction) {
      cleaned[key] = cleanedAction;
    }
  }
  return cleaned;
}
function cleanAction(action) {
  if (!action || !action.action) {
    return void 0;
  }
  const cleaned = {
    action: action.action
  };
  if (action.navigation_path) {
    cleaned.navigation_path = action.navigation_path;
  }
  if (action.url_path) {
    cleaned.url_path = action.url_path;
  }
  if (action.url_target && action.url_target !== "_blank") {
    cleaned.url_target = action.url_target;
  }
  if (action.service) {
    cleaned.service = action.service;
  }
  if (action.target) {
    const target = {
      entity_id: action.target.entity_id || void 0,
      area_id: action.target.area_id || void 0,
      device_id: action.target.device_id || void 0
    };
    if (target.entity_id || target.area_id || target.device_id) {
      cleaned.target = target;
    }
  }
  if (action.service_data && Object.keys(action.service_data).length) {
    cleaned.service_data = action.service_data;
  }
  return cleaned;
}
function getEffectiveLayout(room, config) {
  return room.layout || config.layout || "scroll";
}
function getEffectiveRoomDisplay(config) {
  return config.room_display || "tabs";
}
function getEffectiveColumns(room, config) {
  return Number(room.columns || config.columns || DEFAULT_CONFIG.columns);
}
function getEffectiveTileWidth(room, config) {
  return Number(room.tile_width || config.tile_width || DEFAULT_CONFIG.tile_width);
}
function getEffectiveTileHeight(room, config) {
  return Number(room.tile_height || config.tile_height || DEFAULT_CONFIG.tile_height);
}
function getEffectiveSecondaryInfo(item, config) {
  return item.secondary_info ?? config.secondary_info ?? "last-changed";
}
function getDefaultTapAction(item) {
  return TOGGLE_DOMAINS.has(getEntityDomain(item.entity)) ? { action: "toggle" } : { action: "more-info" };
}
function getStateLabel(stateObj) {
  if (!stateObj) {
    return "Offline";
  }
  const state = String(stateObj.state || "").toLowerCase();
  if (state === "on") {
    return "On";
  }
  if (state === "off") {
    return "Off";
  }
  if (state === "unavailable") {
    return "Offline";
  }
  if (state === "unknown") {
    return "Unknown";
  }
  return stateObj.state;
}
function humanizeState(stateObj, formatter) {
  if (formatter) {
    return formatter(stateObj);
  }
  const domain = getEntityDomain(stateObj.entity_id);
  if (domain === "binary_sensor") {
    return stateObj.state === "on" ? "\u0110ang k\xEDch ho\u1EA1t" : "\u0110ang t\u1EAFt";
  }
  return stateObj.state;
}
function formatRelativeTime(dateString, locale) {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const diffMs = date.getTime() - Date.now();
  const absSeconds = Math.round(Math.abs(diffMs) / 1e3);
  const rtf = new Intl.RelativeTimeFormat(locale || "vi", { numeric: "auto" });
  if (absSeconds < 60) {
    return rtf.format(Math.round(diffMs / 1e3), "second");
  }
  const absMinutes = Math.round(absSeconds / 60);
  if (absMinutes < 60) {
    return rtf.format(Math.round(diffMs / 6e4), "minute");
  }
  const absHours = Math.round(absMinutes / 60);
  if (absHours < 24) {
    return rtf.format(Math.round(diffMs / 36e5), "hour");
  }
  const absDays = Math.round(absHours / 24);
  if (absDays < 30) {
    return rtf.format(Math.round(diffMs / 864e5), "day");
  }
  const absMonths = Math.round(absDays / 30);
  if (absMonths < 12) {
    return rtf.format(Math.round(diffMs / (864e5 * 30)), "month");
  }
  return rtf.format(Math.round(diffMs / (864e5 * 365)), "year");
}
// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e6, o6) {
    if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e6;
  }
  get styleSheet() {
    let t5 = this.o;
    const s4 = this.t;
    if (e && void 0 === t5) {
      const e6 = void 0 !== s4 && 1 === s4.length;
      e6 && (t5 = o.get(s4)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && o.set(s4, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var i = (t5, ...e6) => {
  const o6 = 1 === t5.length ? t5[0] : e6.reduce((e7, s4, o7) => e7 + ((t6) => {
    if (true === t6._$cssResult$) return t6.cssText;
    if ("number" == typeof t6) return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t5[o7 + 1], t5[0]);
  return new n(o6, t5, s);
};
var S = (s4, o6) => {
  if (e) s4.adoptedStyleSheets = o6.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else for (const e6 of o6) {
    const o7 = document.createElement("style"), n5 = t.litNonce;
    void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e6.cssText, s4.appendChild(o7);
  }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e6 = "";
  for (const s4 of t6.cssRules) e6 += s4.cssText;
  return r(e6);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s4) => t5;
var u = { toAttribute(t5, s4) {
  switch (s4) {
    case Boolean:
      t5 = t5 ? l : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s4) {
  let i7 = t5;
  switch (s4) {
    case Boolean:
      i7 = null !== t5;
      break;
    case Number:
      i7 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i7 = JSON.parse(t5);
      } catch (t6) {
        i7 = null;
      }
  }
  return i7;
} };
var f = (t5, s4) => !i2(t5, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var y = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t5, s4), !s4.noAccessor) {
      const i7 = Symbol(), h3 = this.getPropertyDescriptor(t5, i7, s4);
      void 0 !== h3 && e2(this.prototype, t5, h3);
    }
  }
  static getPropertyDescriptor(t5, s4, i7) {
    const { get: e6, set: r5 } = h(this.prototype, t5) ?? { get() {
      return this[s4];
    }, set(t6) {
      this[s4] = t6;
    } };
    return { get: e6, set(s5) {
      const h3 = e6?.call(this);
      r5?.call(this, s5), this.requestUpdate(t5, h3, i7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t5 = n2(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t6 = this.properties, s4 = [...r2(t6), ...o2(t6)];
      for (const i7 of s4) this.createProperty(i7, t6[i7]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s4 = litPropertyMetadata.get(t5);
      if (void 0 !== s4) for (const [t6, i7] of s4) this.elementProperties.set(t6, i7);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s4] of this.elementProperties) {
      const i7 = this._$Eu(t6, s4);
      void 0 !== i7 && this._$Eh.set(i7, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i7 = [];
    if (Array.isArray(s4)) {
      const e6 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e6) i7.unshift(c(s5));
    } else void 0 !== s4 && i7.push(c(s4));
    return i7;
  }
  static _$Eu(t5, s4) {
    const i7 = s4.attribute;
    return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
  }
  addController(t5) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
  }
  removeController(t5) {
    this._$EO?.delete(t5);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i7 of s4.keys()) this.hasOwnProperty(i7) && (t5.set(i7, this[i7]), delete this[i7]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t5) => t5.hostDisconnected?.());
  }
  attributeChangedCallback(t5, s4, i7) {
    this._$AK(t5, i7);
  }
  _$ET(t5, s4) {
    const i7 = this.constructor.elementProperties.get(t5), e6 = this.constructor._$Eu(t5, i7);
    if (void 0 !== e6 && true === i7.reflect) {
      const h3 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s4, i7.type);
      this._$Em = t5, null == h3 ? this.removeAttribute(e6) : this.setAttribute(e6, h3), this._$Em = null;
    }
  }
  _$AK(t5, s4) {
    const i7 = this.constructor, e6 = i7._$Eh.get(t5);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t6 = i7.getPropertyOptions(e6), h3 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
      this._$Em = e6;
      const r5 = h3.fromAttribute(s4, t6.type);
      this[e6] = r5 ?? this._$Ej?.get(e6) ?? r5, this._$Em = null;
    }
  }
  requestUpdate(t5, s4, i7, e6 = false, h3) {
    if (void 0 !== t5) {
      const r5 = this.constructor;
      if (false === e6 && (h3 = this[t5]), i7 ?? (i7 = r5.getPropertyOptions(t5)), !((i7.hasChanged ?? f)(h3, s4) || i7.useDefault && i7.reflect && h3 === this._$Ej?.get(t5) && !this.hasAttribute(r5._$Eu(t5, i7)))) return;
      this.C(t5, s4, i7);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t5, s4, { useDefault: i7, reflect: e6, wrapped: h3 }, r5) {
    i7 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t5) && (this._$Ej.set(t5, r5 ?? s4 ?? this[t5]), true !== h3 || void 0 !== r5) || (this._$AL.has(t5) || (this.hasUpdated || i7 || (s4 = void 0), this._$AL.set(t5, s4)), true === e6 && this._$Em !== t5 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t5));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t7, s5] of this._$Ep) this[t7] = s5;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0) for (const [s5, i7] of t6) {
        const { wrapped: t7 } = i7, e6 = this[s5];
        true !== t7 || this._$AL.has(s5) || void 0 === e6 || this.C(s5, void 0, i7, e6);
      }
    }
    let t5 = false;
    const s4 = this._$AL;
    try {
      t5 = this.shouldUpdate(s4), t5 ? (this.willUpdate(s4), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t5 = false, this._$EM(), s5;
    }
    t5 && this._$AE(s4);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t6) => this._$ET(t6, this[t6]))), this._$EM();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t5) => t5;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var u2 = Array.isArray;
var d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t5) => (i7, ...s4) => ({ _$litType$: t5, strings: i7, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t5, i7) {
  if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i7) : i7;
}
var N = (t5, i7) => {
  const s4 = t5.length - 1, e6 = [];
  let n5, l3 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c4 = v;
  for (let i8 = 0; i8 < s4; i8++) {
    const s5 = t5[i8];
    let a3, u3, d3 = -1, f3 = 0;
    for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
    const x2 = c4 === p2 && t5[i8 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e6.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i8 : x2);
  }
  return [V(t5, l3 + (t5[s4] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e6];
};
var S2 = class _S {
  constructor({ strings: t5, _$litType$: i7 }, e6) {
    let r5;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u3 = t5.length - 1, d3 = this.parts, [f3, v2] = N(t5, i7);
    if (this.el = _S.createElement(f3, e6), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r5 = P.nextNode()) && d3.length < u3; ) {
      if (1 === r5.nodeType) {
        if (r5.hasAttributes()) for (const t6 of r5.getAttributeNames()) if (t6.endsWith(h2)) {
          const i8 = v2[a3++], s4 = r5.getAttribute(t6).split(o3), e7 = /([.?@])?(.*)/.exec(i8);
          d3.push({ type: 1, index: l3, name: e7[2], strings: s4, ctor: "." === e7[1] ? I : "?" === e7[1] ? L : "@" === e7[1] ? z : H }), r5.removeAttribute(t6);
        } else t6.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r5.removeAttribute(t6));
        if (y2.test(r5.tagName)) {
          const t6 = r5.textContent.split(o3), i8 = t6.length - 1;
          if (i8 > 0) {
            r5.textContent = s2 ? s2.emptyScript : "";
            for (let s4 = 0; s4 < i8; s4++) r5.append(t6[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r5.append(t6[i8], c3());
          }
        }
      } else if (8 === r5.nodeType) if (r5.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t6 = -1;
        for (; -1 !== (t6 = r5.data.indexOf(o3, t6 + 1)); ) d3.push({ type: 7, index: l3 }), t6 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t5, i7) {
    const s4 = l2.createElement("template");
    return s4.innerHTML = t5, s4;
  }
};
function M(t5, i7, s4 = t5, e6) {
  if (i7 === E) return i7;
  let h3 = void 0 !== e6 ? s4._$Co?.[e6] : s4._$Cl;
  const o6 = a2(i7) ? void 0 : i7._$litDirective$;
  return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t5), h3._$AT(t5, s4, e6)), void 0 !== e6 ? (s4._$Co ?? (s4._$Co = []))[e6] = h3 : s4._$Cl = h3), void 0 !== h3 && (i7 = M(t5, h3._$AS(t5, i7.values), h3, e6)), i7;
}
var R = class {
  constructor(t5, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    const { el: { content: i7 }, parts: s4 } = this._$AD, e6 = (t5?.creationScope ?? l2).importNode(i7, true);
    P.currentNode = e6;
    let h3 = P.nextNode(), o6 = 0, n5 = 0, r5 = s4[0];
    for (; void 0 !== r5; ) {
      if (o6 === r5.index) {
        let i8;
        2 === r5.type ? i8 = new k(h3, h3.nextSibling, this, t5) : 1 === r5.type ? i8 = new r5.ctor(h3, r5.name, r5.strings, this, t5) : 6 === r5.type && (i8 = new Z(h3, this, t5)), this._$AV.push(i8), r5 = s4[++n5];
      }
      o6 !== r5?.index && (h3 = P.nextNode(), o6++);
    }
    return P.currentNode = l2, e6;
  }
  p(t5) {
    let i7 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i7), i7 += s4.strings.length - 2) : s4._$AI(t5[i7])), i7++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t5, i7, s4, e6) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i7, this._$AM = s4, this.options = e6, this._$Cv = e6?.isConnected ?? true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === t5?.nodeType && (t5 = i7.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i7 = this) {
    t5 = M(this, t5, i7), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
  }
  O(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  T(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
  }
  _(t5) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
  }
  $(t5) {
    const { values: i7, _$litType$: s4 } = t5, e6 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e6) this._$AH.p(i7);
    else {
      const t6 = new R(e6, this), s5 = t6.u(this.options);
      t6.p(i7), this.T(s5), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i7 = C.get(t5.strings);
    return void 0 === i7 && C.set(t5.strings, i7 = new S2(t5)), i7;
  }
  k(t5) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s4, e6 = 0;
    for (const h3 of t5) e6 === i7.length ? i7.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i7[e6], s4._$AI(h3), e6++;
    e6 < i7.length && (this._$AR(s4 && s4._$AB.nextSibling, e6), i7.length = e6);
  }
  _$AR(t5 = this._$AA.nextSibling, s4) {
    for (this._$AP?.(false, true, s4); t5 !== this._$AB; ) {
      const s5 = i3(t5).nextSibling;
      i3(t5).remove(), t5 = s5;
    }
  }
  setConnected(t5) {
    void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i7, s4, e6, h3) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i7, this._$AM = e6, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
  }
  _$AI(t5, i7 = this, s4, e6) {
    const h3 = this.strings;
    let o6 = false;
    if (void 0 === h3) t5 = M(this, t5, i7, 0), o6 = !a2(t5) || t5 !== this._$AH && t5 !== E, o6 && (this._$AH = t5);
    else {
      const e7 = t5;
      let n5, r5;
      for (t5 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r5 = M(this, e7[s4 + n5], i7, n5), r5 === E && (r5 = this._$AH[n5]), o6 || (o6 = !a2(r5) || r5 !== this._$AH[n5]), r5 === A ? t5 = A : t5 !== A && (t5 += (r5 ?? "") + h3[n5 + 1]), this._$AH[n5] = r5;
    }
    o6 && !e6 && this.j(t5);
  }
  j(t5) {
    t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A ? void 0 : t5;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
  }
};
var z = class extends H {
  constructor(t5, i7, s4, e6, h3) {
    super(t5, i7, s4, e6, h3), this.type = 5;
  }
  _$AI(t5, i7 = this) {
    if ((t5 = M(this, t5, i7, 0) ?? A) === E) return;
    const s4 = this._$AH, e6 = t5 === A && s4 !== A || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h3 = t5 !== A && (s4 === A || e6);
    e6 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var Z = class {
  constructor(t5, i7, s4) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    M(this, t5);
  }
};
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.2");
var D = (t5, i7, s4) => {
  const e6 = s4?.renderBefore ?? i7;
  let h3 = e6._$litPart$;
  if (void 0 === h3) {
    const t6 = s4?.renderBefore ?? null;
    e6._$litPart$ = h3 = new k(i7.insertBefore(c3(), t6), t6, void 0, s4 ?? {});
  }
  return h3._$AI(t5), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a;
    const t5 = super.createRenderRoot();
    return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t5.firstChild), t5;
  }
  update(t5) {
    const r5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.2");

// node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e4 = (t5) => (...e6) => ({ _$litDirective$: t5, values: e6 });
var i5 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e6, i7) {
    this._$Ct = t5, this._$AM = e6, this._$Ci = i7;
  }
  _$AS(t5, e6) {
    return this.update(t5, e6);
  }
  update(t5, e6) {
    return this.render(...e6);
  }
};

// node_modules/lit-html/directives/style-map.js
var n4 = "important";
var i6 = " !" + n4;
var o5 = e4(class extends i5 {
  constructor(t5) {
    if (super(t5), t5.type !== t3.ATTRIBUTE || "style" !== t5.name || t5.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t5) {
    return Object.keys(t5).reduce((e6, r5) => {
      const s4 = t5[r5];
      return null == s4 ? e6 : e6 + `${r5 = r5.includes("-") ? r5 : r5.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s4};`;
    }, "");
  }
  update(e6, [r5]) {
    const { style: s4 } = e6.element;
    if (void 0 === this.ft) return this.ft = new Set(Object.keys(r5)), this.render(r5);
    for (const t5 of this.ft) null == r5[t5] && (this.ft.delete(t5), t5.includes("-") ? s4.removeProperty(t5) : s4[t5] = null);
    for (const t5 in r5) {
      const e7 = r5[t5];
      if (null != e7) {
        this.ft.add(t5);
        const r6 = "string" == typeof e7 && e7.endsWith(i6);
        t5.includes("-") || r6 ? s4.setProperty(t5, r6 ? e7.slice(0, -11) : e7, r6 ? n4 : "") : s4[t5] = e7;
      }
    }
    return E;
  }
});

// node_modules/lit-html/directives/class-map.js
var e5 = e4(class extends i5 {
  constructor(t5) {
    if (super(t5), t5.type !== t3.ATTRIBUTE || "class" !== t5.name || t5.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t5) {
    return " " + Object.keys(t5).filter((s4) => t5[s4]).join(" ") + " ";
  }
  update(s4, [i7]) {
    if (void 0 === this.st) {
      this.st = /* @__PURE__ */ new Set(), void 0 !== s4.strings && (this.nt = new Set(s4.strings.join(" ").split(/\s/).filter((t5) => "" !== t5)));
      for (const t5 in i7) i7[t5] && !this.nt?.has(t5) && this.st.add(t5);
      return this.render(i7);
    }
    const r5 = s4.element.classList;
    for (const t5 of this.st) t5 in i7 || (r5.remove(t5), this.st.delete(t5));
    for (const t5 in i7) {
      const s5 = !!i7[t5];
      s5 === this.st.has(t5) || this.nt?.has(t5) || (s5 ? (r5.add(t5), this.st.add(t5)) : (r5.remove(t5), this.st.delete(t5)));
    }
    return E;
  }
});

// node_modules/custom-card-helpers/dist/index.m.js
var t4;
var r4;
!(function(e6) {
  e6.language = "language", e6.system = "system", e6.comma_decimal = "comma_decimal", e6.decimal_comma = "decimal_comma", e6.space_comma = "space_comma", e6.none = "none";
})(t4 || (t4 = {})), (function(e6) {
  e6.language = "language", e6.system = "system", e6.am_pm = "12", e6.twenty_four = "24";
})(r4 || (r4 = {}));
function O() {
  return (O = Object.assign || function(e6) {
    for (var t5 = 1; t5 < arguments.length; t5++) {
      var r5 = arguments[t5];
      for (var n5 in r5) Object.prototype.hasOwnProperty.call(r5, n5) && (e6[n5] = r5[n5]);
    }
    return e6;
  }).apply(this, arguments);
}
function E2(e6) {
  return e6.substr(0, e6.indexOf("."));
}
var Z2 = ["closed", "locked", "off"];
var ne = function(e6, t5, r5, n5) {
  n5 = n5 || {}, r5 = null == r5 ? {} : r5;
  var i7 = new Event(t5, { bubbles: void 0 === n5.bubbles || n5.bubbles, cancelable: Boolean(n5.cancelable), composed: void 0 === n5.composed || n5.composed });
  return i7.detail = r5, e6.dispatchEvent(i7), i7;
};
var le = function(e6) {
  ne(window, "haptic", e6);
};
var de = function(e6, t5, r5) {
  void 0 === r5 && (r5 = false), r5 ? history.replaceState(null, "", t5) : history.pushState(null, "", t5), ne(window, "location-changed", { replace: r5 });
};
var fe = function(e6, t5, r5) {
  void 0 === r5 && (r5 = true);
  var n5, i7 = E2(t5), a3 = "group" === i7 ? "homeassistant" : i7;
  switch (i7) {
    case "lock":
      n5 = r5 ? "unlock" : "lock";
      break;
    case "cover":
      n5 = r5 ? "open_cover" : "close_cover";
      break;
    default:
      n5 = r5 ? "turn_on" : "turn_off";
  }
  return e6.callService(a3, n5, { entity_id: t5 });
};
var ge = function(e6, t5) {
  var r5 = Z2.includes(e6.states[t5].state);
  return fe(e6, t5, r5);
};
var be = function(e6, t5, r5, n5, i7) {
  var a3;
  if (i7 && r5.double_tap_action ? a3 = r5.double_tap_action : n5 && r5.hold_action ? a3 = r5.hold_action : !n5 && r5.tap_action && (a3 = r5.tap_action), a3 || (a3 = { action: "more-info" }), !a3.confirmation || a3.confirmation.exemptions && a3.confirmation.exemptions.some(function(e7) {
    return e7.user === t5.user.id;
  }) || confirm(a3.confirmation.text || "Are you sure you want to " + a3.action + "?")) switch (a3.action) {
    case "more-info":
      (a3.entity || r5.entity || r5.camera_image) && (ne(e6, "hass-more-info", { entityId: a3.entity ? a3.entity : r5.entity ? r5.entity : r5.camera_image }), a3.haptic && le(a3.haptic));
      break;
    case "navigate":
      a3.navigation_path && (de(0, a3.navigation_path), a3.haptic && le(a3.haptic));
      break;
    case "url":
      if (!a3.url_path) return;
      var d3 = a3.url_target || "_blank";
      "_self" === d3 ? window.location.assign(a3.url_path) : window.open(a3.url_path, d3, "noopener,noreferrer"), a3.haptic && le(a3.haptic);
      break;
    case "toggle":
      r5.entity && (ge(t5, r5.entity), a3.haptic && le(a3.haptic));
      break;
    case "call-service":
      if (!a3.service) return;
      var o6 = a3.service.split(".", 2), u3 = o6[0], c4 = o6[1], m2 = O({}, a3.service_data);
      "entity" === m2.entity_id && (m2.entity_id = r5.entity), t5.callService(u3, c4, m2, a3.target), a3.haptic && le(a3.haptic);
      break;
    case "fire-dom-event":
      ne(e6, "ll-custom", a3), a3.haptic && le(a3.haptic);
  }
};
function ve(e6) {
  return void 0 !== e6 && "none" !== e6.action;
}

// src/soft-room-card.ts
var SoftRoomCard = class extends i4 {
  constructor() {
    super(...arguments);
    this._activeRoomIndex = 0;
    this._isCompactViewport = false;
    this._holdTimers = /* @__PURE__ */ new Map();
    this._clickTimers = /* @__PURE__ */ new Map();
    this._holdTriggered = /* @__PURE__ */ new Set();
    this._pointerStarts = /* @__PURE__ */ new Map();
    this._scrollDrag = void 0;
    this._suppressClickUntil = 0;
    this._boundWindowMouseScrollMove = (event) => this._onWindowMouseScrollMove(event);
    this._boundWindowMouseScrollEnd = () => this._endScrollDrag();
    this._boundWindowTouchScrollMove = (event) => this._onWindowTouchScrollMove(event);
    this._boundWindowTouchScrollEnd = () => this._endScrollDrag();
    this._onViewportChange = (event) => {
      const nextMatch = "matches" in (event || {}) ? Boolean(event.matches) : false;
      this._isCompactViewport = event ? nextMatch : Boolean(window.matchMedia("(max-width: 680px)").matches);
    };
  }
  static getConfigElement() {
    return document.createElement(`${CARD_TYPE}-editor`);
  }
  static getStubConfig() {
    return createStubConfig();
  }
  connectedCallback() {
    super.connectedCallback();
    this._startTicker();
    this._bindViewportListener();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTicker();
    this._unbindViewportListener();
  }
  setConfig(config) {
    const normalized = normalizeConfig(config);
    const prepared = normalized.rooms.length ? normalized : createStubConfig();
    this._config = cleanConfig(prepared);
    this._activeRoomIndex = Math.min(this._activeRoomIndex, this._config.rooms.length - 1);
  }
  getCardSize() {
    if (!this._config?.rooms?.length) {
      return 4;
    }
    const cardChrome = 28;
    const roomGap = 12;
    const roomDisplay = getEffectiveRoomDisplay(this._config);
    if (roomDisplay === "tabs") {
      const room = this._config.rooms[this._activeRoomIndex] || this._config.rooms[0];
      const tabsHeight = 44;
      const totalHeight2 = cardChrome + tabsHeight + roomGap + this._estimateRoomHeight(room, false);
      return Math.max(4, Math.ceil(totalHeight2 / 50));
    }
    const totalHeight = this._config.rooms.reduce((sum, room, index) => {
      return sum + this._estimateRoomHeight(room, true) + (index < this._config.rooms.length - 1 ? roomGap : 0);
    }, cardChrome);
    return Math.max(4, Math.ceil(totalHeight / 50));
  }
  _estimateRoomHeight(room, includeHeader) {
    if (!this._config) {
      return 0;
    }
    const itemCount = room.items?.length || 0;
    const tileHeight = getEffectiveTileHeight(room, this._config);
    const layout = this._getResponsiveLayout(room);
    const columns = this._estimateGridColumns(room);
    const headerHeight = includeHeader ? 40 : 0;
    const sectionGap = includeHeader && itemCount > 0 ? 10 : 0;
    if (!itemCount) {
      return headerHeight;
    }
    if (layout === "scroll") {
      return headerHeight + sectionGap + tileHeight;
    }
    const rows = Math.ceil(itemCount / columns);
    const gridGap = 8;
    return headerHeight + sectionGap + rows * tileHeight + Math.max(rows - 1, 0) * gridGap;
  }
  _estimateGridColumns(room) {
    if (!this._config) {
      return 1;
    }
    let columns = Math.max(1, getEffectiveColumns(room, this._config));
    if (this._isCompactViewport) {
      return 1;
    }
    if (typeof window !== "undefined" && window.matchMedia?.("(max-width: 900px)")?.matches) {
      columns = Math.min(columns, 2);
    }
    return Math.max(1, columns);
  }
  _bindViewportListener() {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    this._viewportMedia = window.matchMedia("(max-width: 680px)");
    this._isCompactViewport = this._viewportMedia.matches;
    if (typeof this._viewportMedia.addEventListener === "function") {
      this._viewportMedia.addEventListener("change", this._onViewportChange);
      return;
    }
    if (typeof this._viewportMedia.addListener === "function") {
      this._viewportMedia.addListener(this._onViewportChange);
    }
  }
  _unbindViewportListener() {
    if (!this._viewportMedia) {
      return;
    }
    if (typeof this._viewportMedia.removeEventListener === "function") {
      this._viewportMedia.removeEventListener("change", this._onViewportChange);
    } else if (typeof this._viewportMedia.removeListener === "function") {
      this._viewportMedia.removeListener(this._onViewportChange);
    }
    this._viewportMedia = void 0;
  }
  render() {
    if (!this._config) {
      return A;
    }
    const theme2 = resolveTheme(this._config);
    const cardVars = {
      "--soft-room-background": theme2.background,
      "--soft-room-surface": theme2.surface,
      "--soft-room-border": theme2.border,
      "--soft-room-accent": theme2.accent,
      "--soft-room-text": theme2.text,
      "--soft-room-muted": theme2.mutedText,
      "--soft-room-state": theme2.stateText,
      "--tab-bg-color": theme2.tabBackground
    };
    return b2`
      <ha-card style=${o5(cardVars)}>
        <div class="wrap">
          ${this._renderRooms()}
        </div>
      </ha-card>
    `;
  }
  _renderRooms() {
    if (!this._config) {
      return A;
    }
    const roomDisplay = getEffectiveRoomDisplay(this._config);
    if (roomDisplay === "tabs" && this._config.rooms.length > 1) {
      const activeRoom = this._config.rooms[this._activeRoomIndex] || this._config.rooms[0];
      return b2`
        <div class="room-head-shell">
          <div class="room-tabs">
            ${this._config.rooms.map((room, index) => b2`
              <button
                class=${e5({ "room-tab": true, "room-tab--active": index === this._activeRoomIndex })}
                style=${o5({ "--room-accent": room.accent_color || "var(--soft-room-accent)" })}
                @click=${() => this._setActiveRoom(index)}
              >
                ${room.title || `Room ${index + 1}`}
              </button>
            `)}
          </div>
        </div>
        ${this._renderRoom(activeRoom, this._activeRoomIndex, true, true)}
      `;
    }
    return this._config.rooms.map((room, index) => this._renderRoom(room, index, false, false));
  }
  _renderRoom(room, roomIndex, hideHeader = false, isActive = false) {
    if (!this._config) {
      return A;
    }
    const layout = this._getResponsiveLayout(room);
    const columns = getEffectiveColumns(room, this._config);
    const tileWidth = getEffectiveTileWidth(room, this._config);
    const tileHeight = getEffectiveTileHeight(room, this._config);
    const canSwipe = layout === "scroll" && room.items.length > columns;
    return b2`
      <section
        class=${e5({ room: true, "room--active": isActive })}
        style=${o5({
      "--room-accent": room.accent_color || "var(--soft-room-accent)",
      "--room-columns": String(columns),
      "--tile-width": `${tileWidth}px`,
      "--tile-height": `${tileHeight}px`
    })}
      >
        ${hideHeader ? A : b2`
              <div class="room-head-shell room-head-shell--header">
                <div class="room-header">${room.title || `Room ${roomIndex + 1}`}</div>
              </div>
            `}
        <div class=${e5({ "room-panel": true, "room-panel--swipe-hint": canSwipe })}>
          <div
            class=${e5({
      tiles: true,
      "tiles--scroll": layout === "scroll",
      "tiles--grid": layout === "grid"
    })}
            @mousedown=${(event) => this._onScrollMouseDown(event)}
            @touchstart=${(event) => this._onScrollTouchStart(event)}
          >
            ${room.items.map((item, itemIndex) => this._renderTile(room, roomIndex, item, itemIndex))}
          </div>
        </div>
      </section>
    `;
  }
  _getResponsiveLayout(room) {
    if (!this._config) {
      return "scroll";
    }
    const layout = getEffectiveLayout(room, this._config);
    if (this._isCompactViewport) {
      return "scroll";
    }
    return layout;
  }
  _setActiveRoom(index) {
    this._activeRoomIndex = index;
  }
  _renderTile(room, roomIndex, item, itemIndex) {
    const stateObj = item.entity ? this.hass?.states?.[item.entity] : void 0;
    const missing = Boolean(item.entity) && !stateObj;
    const name = item.name || stateObj?.attributes?.friendly_name || item.entity || "Ch\u01B0a c\u1EA5u h\xECnh";
    const icon = item.icon || stateObj?.attributes?.icon || "mdi:toggle-switch-outline";
    const stateLabel = getStateLabel(stateObj);
    const secondary = this._getSecondaryLabel(item, stateObj);
    const accent = room.accent_color || resolveTheme(this._config || DEFAULT_CONFIG).accent;
    const actionConfig = this._getInteractiveConfig(item);
    const interactionKey = `${roomIndex}:${itemIndex}`;
    return b2`
      <button
        type="button"
        class=${e5({ tile: true, "tile--missing": missing, "tile--on": stateObj?.state === "on" })}
        style=${o5({
      "--tile-icon-color": stateObj?.state === "on" ? accent : "#666466",
      "--tile-accent": accent
    })}
        aria-label=${name}
        @pointerdown=${(event) => this._onPointerDown(event, interactionKey, actionConfig)}
        @pointermove=${(event) => this._onPointerMove(event, interactionKey)}
        @pointerup=${() => this._onPointerEnd(interactionKey)}
        @pointercancel=${() => this._onPointerEnd(interactionKey)}
        @pointerleave=${() => this._onPointerEnd(interactionKey)}
        @click=${() => this._onTileClick(interactionKey, actionConfig)}
        @keydown=${(event) => this._onTileKeyDown(event, interactionKey, actionConfig)}
        data-room-index=${String(roomIndex)}
        data-item-index=${String(itemIndex)}
      >
        <div class="tile-top">
          <div class="icon"><ha-icon .icon=${icon}></ha-icon></div>
          <div class="state">${stateLabel}</div>
        </div>
        <div class="tile-copy">
          <div class="name">${name}</div>
          ${secondary ? b2`<div class="secondary">${secondary}</div>` : A}
        </div>
      </button>
    `;
  }
  _getInteractiveConfig(item) {
    return {
      ...item,
      tap_action: item.tap_action || getDefaultTapAction(item),
      hold_action: item.hold_action,
      double_tap_action: item.double_tap_action
    };
  }
  _triggerAction(config, hold = false, double = false) {
    if (!this.hass || !this._config) {
      return;
    }
    be(this, this.hass, config, hold, double);
  }
  _beginScrollDrag(container, clientX, clientY, kind) {
    this._removeScrollDragListeners();
    this._scrollDrag = {
      kind,
      container,
      startX: clientX,
      startY: clientY,
      scrollLeft: container.scrollLeft,
      dragging: false
    };
  }
  _onScrollMouseDown(event) {
    const container = event.currentTarget;
    if (!(container instanceof HTMLElement) || !container.classList.contains("tiles--scroll")) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    this._beginScrollDrag(container, event.clientX, event.clientY, "mouse");
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", this._boundWindowMouseScrollMove);
      window.addEventListener("mouseup", this._boundWindowMouseScrollEnd);
    }
    event.preventDefault();
  }
  _onScrollTouchStart(event) {
    const container = event.currentTarget;
    const touch = event.touches[0];
    if (!(container instanceof HTMLElement) || !container.classList.contains("tiles--scroll") || !touch) {
      return;
    }
    // Let the browser handle touch scrolling natively via CSS overflow-x: auto.
    // Only track scroll events to suppress accidental tile clicks after swipe.
    const self = this;
    let scrolled = false;
    const onScroll = () => {
      if (!scrolled) {
        scrolled = true;
        self._cancelPendingInteractions();
      }
      self._suppressClickUntil = Date.now() + 300;
    };
    const cleanup = () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchend", cleanup);
      window.removeEventListener("touchcancel", cleanup);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchend", cleanup, { once: true });
    window.addEventListener("touchcancel", cleanup, { once: true });
  }
  _moveScrollDrag(clientX, clientY, preventDefault) {
    const drag = this._scrollDrag;
    if (!drag) {
      return;
    }
    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;
    if (!drag.dragging) {
      if (Math.abs(deltaX) < 6) {
        return;
      }
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        this._endScrollDrag();
        return;
      }
      drag.dragging = true;
      drag.container.classList.add("tiles--dragging");
      this._cancelPendingInteractions();
    }
    drag.container.scrollLeft = drag.scrollLeft - deltaX;
    this._suppressClickUntil = Date.now() + 250;
    preventDefault();
  }
  _onWindowMouseScrollMove(event) {
    this._moveScrollDrag(event.clientX, event.clientY, () => event.preventDefault());
  }
  _onWindowTouchScrollMove(event) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    this._moveScrollDrag(touch.clientX, touch.clientY, () => event.preventDefault());
  }
  _endScrollDrag() {
    const drag = this._scrollDrag;
    if (!drag) {
      return;
    }
    if (drag.dragging) {
      this._suppressClickUntil = Date.now() + 250;
      drag.container.classList.remove("tiles--dragging");
    }
    this._removeScrollDragListeners();
    this._scrollDrag = void 0;
  }
  _removeScrollDragListeners() {
    if (typeof window === "undefined") {
      return;
    }
    window.removeEventListener("mousemove", this._boundWindowMouseScrollMove);
    window.removeEventListener("mouseup", this._boundWindowMouseScrollEnd);
    window.removeEventListener("touchmove", this._boundWindowTouchScrollMove);
    window.removeEventListener("touchend", this._boundWindowTouchScrollEnd);
    window.removeEventListener("touchcancel", this._boundWindowTouchScrollEnd);
  }
  _cancelPendingInteractions() {
    this._holdTimers.forEach((timer) => window.clearTimeout(timer));
    this._holdTimers.clear();
    this._pointerStarts.clear();
  }
  _onPointerDown(event, key, config) {
    this._clearHoldTimer(key);
    if (!ve(config.hold_action)) {
      return;
    }
    this._pointerStarts.set(key, { x: event.clientX, y: event.clientY });
    const timer = window.setTimeout(() => {
      this._holdTriggered.add(key);
      this._triggerAction(config, true, false);
      this._pointerStarts.delete(key);
      this._holdTimers.delete(key);
    }, 500);
    this._holdTimers.set(key, timer);
  }
  _onPointerMove(event, key) {
    const start = this._pointerStarts.get(key);
    if (!start) {
      return;
    }
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) {
      this._onPointerEnd(key);
    }
  }
  _onPointerEnd(key) {
    this._clearHoldTimer(key);
    this._pointerStarts.delete(key);
  }
  _onTileClick(key, config) {
    if (Date.now() < this._suppressClickUntil) {
      return;
    }
    if (this._holdTriggered.has(key)) {
      this._holdTriggered.delete(key);
      return;
    }
    if (ve(config.double_tap_action)) {
      const existing = this._clickTimers.get(key);
      if (existing) {
        window.clearTimeout(existing);
        this._clickTimers.delete(key);
        this._triggerAction(config, false, true);
        return;
      }
      const timer = window.setTimeout(() => {
        this._clickTimers.delete(key);
        this._triggerAction(config, false, false);
      }, 250);
      this._clickTimers.set(key, timer);
      return;
    }
    this._triggerAction(config, false, false);
  }
  _onTileKeyDown(event, key, config) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    this._onTileClick(key, config);
  }
  _clearHoldTimer(key) {
    const timer = this._holdTimers.get(key);
    if (timer) {
      window.clearTimeout(timer);
      this._holdTimers.delete(key);
    }
  }
  _getSecondaryLabel(item, stateObj) {
    if (!stateObj) {
      return item.entity ? "Kh\xF4ng t\xECm th\u1EA5y entity" : "Ch\u1ECDn entity trong editor";
    }
    if (!this._config) {
      return "";
    }
    const mode = getEffectiveSecondaryInfo(item, this._config);
    if (mode === "none") {
      return "";
    }
    if (mode === "state") {
      return humanizeState(stateObj, this.hass?.formatEntityState?.bind(this.hass));
    }
    const locale = this.hass?.locale?.language || document.documentElement.lang || navigator.language || "vi";
    return formatRelativeTime(stateObj.last_changed, locale);
  }
  _startTicker() {
    this._stopTicker();
    this._ticker = window.setInterval(() => this.requestUpdate(), 6e4);
  }
  _stopTicker() {
    if (this._ticker) {
      window.clearInterval(this._ticker);
      this._ticker = void 0;
    }
    this._holdTimers.forEach((timer) => window.clearTimeout(timer));
    this._clickTimers.forEach((timer) => window.clearTimeout(timer));
    this._holdTimers.clear();
    this._clickTimers.clear();
    this._holdTriggered.clear();
    this._pointerStarts.clear();
    this._scrollDrag?.container.classList.remove("tiles--dragging");
    this._removeScrollDragListeners();
    this._scrollDrag = void 0;
    this._suppressClickUntil = 0;
  }
};
SoftRoomCard.properties = {
  hass: { attribute: false },
  _config: { state: true },
  _activeRoomIndex: { state: true },
  _isCompactViewport: { state: true }
};
SoftRoomCard.styles = i`
    :host {
      display: block;
    }

    ha-card {
      background: transparent;
      position: relative;
      border: none;
      box-shadow: none;
      border-radius: 24px;
      overflow: hidden;
      padding: 14px 0 12px;
      color: var(--soft-room-text);
    }

    ha-card::before,
    ha-card::after {
      content: none;
      display: none !important;
    }

    .wrap {
      padding: 0;
      display: grid;
      gap: 12px;
    }

    .room {
      display: grid;
      gap: 10px;
      min-width: 0;
    }

    .room--active .tiles {
      position: relative;
    }

    .room--active .tiles::before {
      content: none;
      pointer-events: none;
    }

    .room-head-shell {
      padding: 0;
      border-radius: 0;
      overflow: visible;
      background: transparent;
      border: none;
      box-shadow: none;
      margin-inline: 0;
      min-width: 0;
    }

    .room-head-shell--header {
      padding: 0;
      margin-inline: 0;
    }

    .room-tabs {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      align-items: center;
      min-height: 0;
      padding: 0;
      border-radius: 24px;
      background: transparent;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      touch-action: manipulation;
      box-shadow: none;
      border: none;
    }

    .room-tabs::-webkit-scrollbar {
      display: none;
    }

    .room-tab {
      flex: 1 1 0;
      border: 1px solid rgba(255, 255, 255, 0.52);
      border-radius: 20px;
      min-height: 44px;
      min-width: 60px;
      padding: 0 18px;
      background: color-mix(in srgb, #ffffff 58%, var(--soft-room-surface) 42%);
      color: var(--soft-room-text);
      font: inherit;
      font-size: 15px;
      font-weight: 840;
      letter-spacing: -0.03em;
      white-space: nowrap;
      cursor: pointer;
      display: inline-grid;
      align-items: center;
      justify-content: center;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.62),
        0 4px 10px rgba(103, 72, 82, 0.06);
      transition:
        transform 160ms cubic-bezier(0.4, 0, 0.2, 1),
        background 180ms ease,
        color 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease;
      scroll-snap-align: start;
      position: relative;
      overflow: hidden;
    }

    .room-tab::before {
      content: none;
    }

    .room-tab:hover::before,
    .room-tab:focus-visible::before {
      opacity: 1;
    }

    .room-tab:hover,
    .room-tab:focus-visible {
      transform: translateY(-1px);
      outline: none;
      background: color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 14%, #fff4f1);
      border-color: color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 24%, rgba(255, 255, 255, 0.58));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.56),
        0 6px 14px rgba(103, 72, 82, 0.08);
    }

    .room-tab--active {
      background: linear-gradient(180deg, color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 80%, #ff74b9), var(--room-accent, var(--soft-room-accent)));
      color: #fff;
      border-color: transparent;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.24),
        0 8px 16px color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 26%, transparent);
      transform: translateY(-1px);
      filter: saturate(1.05) brightness(1.02);
    }

    .room-tab--active::before {
      content: none;
    }

    .room-tab--active:hover,
    .room-tab--active:focus-visible {
      transform: translateY(-1px);
      outline: none;
      background: linear-gradient(180deg, color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 80%, #ff74b9), var(--room-accent, var(--soft-room-accent)));
      color: #fff;
      border-color: transparent;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.26),
        0 8px 16px color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 36%, transparent);
    }

    .room-header {
      border-radius: 999px;
      background: linear-gradient(180deg, color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 80%, #ff74b9), var(--room-accent, var(--soft-room-accent)));
      color: #fff;
      font-size: 16px;
      font-weight: 850;
      letter-spacing: -0.03em;
      text-align: center;
      padding: 10px 18px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.24),
        0 6px 12px color-mix(in srgb, var(--room-accent, var(--soft-room-accent)) 22%, transparent);
    }

    .room-panel {
      padding: 0 0 20px;
      border-radius: 0;
      background: transparent;
      border: none;
      box-shadow: none;
      min-width: 0;
      overflow: hidden;
      position: relative;
    }

    .room-panel--swipe-hint::after {
      content: "›";
      position: absolute;
      right: 6px;
      top: 50%;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      line-height: 1;
      font-weight: 700;
      color: color-mix(in srgb, var(--soft-room-text) 80%, white 20%);
      background: color-mix(in srgb, var(--soft-room-surface) 72%, white 28%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      pointer-events: none;
      z-index: 2;
    }

    .tiles {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .tiles--scroll {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: var(--tile-width, 160px);
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      scroll-padding-inline: 0;
      padding: 0;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      touch-action: manipulation;
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
    }

    .tiles--scroll::-webkit-scrollbar {
      display: none;
    }

    .tiles--scroll.tiles--dragging {
      cursor: grabbing;
      scroll-snap-type: none;
    }

    .tiles--scroll.tiles--dragging .tile {
      pointer-events: none;
    }

    .tiles--scroll .tile {
      touch-action: manipulation;
    }

    .tiles--scroll.tiles--wrapped {
      grid-auto-flow: row;
      grid-auto-columns: unset;
      grid-template-columns: repeat(var(--room-columns, 4), minmax(0, var(--tile-width, 160px)));
      overflow-x: visible;
      overscroll-behavior-x: auto;
      scroll-snap-type: none;
      cursor: default;
      user-select: auto;
      -webkit-user-select: auto;
      justify-content: start;
    }

    .tiles--scroll.tiles--wrapped .tile {
      touch-action: manipulation;
    }

    .tiles--grid {
      display: grid;
      grid-template-columns: repeat(var(--room-columns, 4), minmax(0, var(--tile-width, 160px)));
      justify-content: start;
    }

    .tile {
      appearance: none;
      position: relative;
      height: var(--tile-height, 160px);
      min-height: var(--tile-height, 160px);
      width: 100%;
      min-width: 0;
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.08)),
        linear-gradient(135deg, rgba(255, 224, 213, 0.78) 0%, rgba(248, 208, 215, 0.66) 100%);
      border: 1px solid rgba(255, 255, 255, 0.38);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.34),
        0 4px 10px rgba(102, 72, 82, 0.05);
      padding: 14px 12px 10px;
      cursor: pointer;
      transition:
        transform 140ms ease,
        box-shadow 140ms ease,
        background 140ms ease;
      overflow: hidden;
      scroll-snap-align: start;
      text-align: left;
      font: inherit;
      color: inherit;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 12px;
    }

    .tile::before {
      content: none;
    }

    .tile:hover,
    .tile:focus-visible {
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.36),
        0 8px 16px rgba(102, 72, 82, 0.07);
    }

    .tile:active {
      transform: translateY(0);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .tile--missing {
      border-style: dashed;
      opacity: 0.7;
    }

    .tile--on {
      border-color: rgba(255, 255, 255, 0.44);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.1)),
        linear-gradient(135deg, rgba(255, 214, 194, 0.9) 0%, rgba(248, 198, 206, 0.8) 100%);
    }

    .tile-top {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: auto max-content;
      align-items: flex-start;
      gap: 8px;
      min-width: 0;
    }

    .tile-copy {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 4px;
      align-content: start;
      align-self: end;
      min-width: 0;
    }

    .icon {
      color: var(--tile-icon-color, #666466);
      width: 38px;
      height: 38px;
      position: relative;
      z-index: 1;
      display: grid;
      place-items: center;
    }

    ha-icon {
      --mdc-icon-size: 38px;
      width: 38px;
      height: 38px;
    }

    .state {
      display: block;
      flex: 0 0 auto;
      min-width: max-content;
      color: #121212;
      font-size: 14px;
      line-height: 1;
      font-weight: 700;
      letter-spacing: -0.03em;
      white-space: nowrap;
      text-align: right;
      padding-top: 2px;
    }

    .name {
      color: var(--soft-room-text);
      font-size: 14px;
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -0.04em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      z-index: 1;
      min-width: 0;
    }

    .secondary {
      color: rgba(34, 31, 36, 0.7);
      font-size: 12px;
      line-height: 1.2;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      z-index: 1;
      min-width: 0;
    }

    @media (max-width: 900px) {
      .tiles--grid,
      .tiles--scroll.tiles--wrapped {
        grid-template-columns: repeat(2, minmax(0, min(100%, var(--tile-width, 160px))));
      }
    }

    @media (max-width: 560px) {
      .wrap {
        padding: 0;
        gap: 8px;
      }

      .room-header {
        font-size: 14px;
        padding: 8px 14px;
      }

      .room-tab {
        min-height: 38px;
        font-size: 14px;
        padding: 0 14px;
      }

      .room-panel {
        padding: 0;
        border-radius: 0;
      }

      .tiles {
        gap: 6px;
      }

      .tiles--scroll {
        grid-auto-columns: min(42vw, var(--tile-width, 160px));
        padding-bottom: 0;
      }

      .tiles--scroll.tiles--wrapped {
        grid-auto-columns: unset;
        grid-template-columns: repeat(2, minmax(0, min(100%, var(--tile-width, 160px))));
      }

      .tiles--grid {
        grid-template-columns: repeat(2, minmax(0, min(100%, var(--tile-width, 160px))));
      }

      .tile {
        height: var(--tile-height, 160px);
        min-height: var(--tile-height, 160px);
        padding: 12px 10px 8px;
        border-radius: 16px;
        gap: 10px;
      }

      .icon {
        width: 34px;
        height: 34px;
      }

      ha-icon {
        --mdc-icon-size: 34px;
        width: 34px;
        height: 34px;
      }

      .state {
        font-size: 13px;
      }

      .name {
        font-size: 13px;
      }

      .secondary {
        font-size: 11px;
      }
    }

    @media (max-width: 340px) {
      .tiles--grid,
      .tiles--scroll.tiles--wrapped {
        grid-template-columns: minmax(0, min(100%, var(--tile-width, 160px)));
      }

      .tiles--scroll {
        grid-auto-columns: min(76vw, var(--tile-width, 160px));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .room-tab,
      .tile {
        transition: none;
      }

      .room-tab:hover,
      .room-tab:focus-visible,
      .tile:hover,
      .tile:focus-visible,
      .tile:active {
        transform: none;
      }
    }
  `;
customElements.define(CARD_TYPE, SoftRoomCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: `custom:${CARD_TYPE}`,
  name: CARD_NAME,
  description: "Card ph\xF2ng phong c\xE1ch pastel, editor chu\u1EA9n Home Assistant, h\u1ED7 tr\u1EE3 multiroom.",
  preview: true
});

// src/fire-event.ts
function fireEvent(node, type, detail = {}, options = {}) {
  const event = new Event(type, {
    bubbles: options.bubbles ?? true,
    cancelable: options.cancelable ?? false,
    composed: options.composed ?? true
  });
  Object.assign(event, { detail });
  node.dispatchEvent(event);
  return event;
}

// src/soft-room-card-editor.ts
var SoftRoomCardEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = createStubConfig();
    this._addRoom = () => {
      this._config = this._prepareEditorConfig({
        ...this._config,
        rooms: [...this._config.rooms, ensureRoom()]
      });
      this._emitConfig();
    };
  }
  setConfig(config) {
    this._config = this._prepareEditorConfig(config?.rooms?.length ? config : createStubConfig());
  }
  render() {
    if (!this._config) {
      return A;
    }
    return b2`
      <div class="editor">
        <div class="panel">
          <div class="panel-title">Cấu hình chung</div>
          <div class="grid">
            ${this._selector("Preset theme", { select: { mode: "dropdown", options: this._options(["pastel", "warm", "neutral", "custom"]) } }, this._config.theme || DEFAULT_CONFIG.theme, (value) => this._updateRoot("theme", value))}
            ${this._selector("Hi\u1EC3n th\u1ECB room", { select: { mode: "dropdown", options: this._options(["tabs", "stack"]) } }, this._config.room_display || DEFAULT_CONFIG.room_display, (value) => this._updateRoot("room_display", value))}
            ${this._selector("Layout m\u1EB7c \u0111\u1ECBnh", { select: { mode: "dropdown", options: this._options(["scroll", "grid"]) } }, this._config.layout || DEFAULT_CONFIG.layout, (value) => this._updateRoot("layout", value))}
            ${this._selector("S\u1ED1 c\u1ED9t m\u1EB7c \u0111\u1ECBnh", { number: { min: 1, max: 6, mode: "box" } }, this._config.columns ?? "", (value) => this._updateRoot("columns", value === "" ? void 0 : Number(value)))}
            <div class="highlight-field">${this._selector("\u0110\u1ED9 r\u1ED9ng tile", { number: { min: 160, max: 340, mode: "box" } }, this._config.tile_width ?? "", (value) => this._updateRoot("tile_width", value === "" ? void 0 : Number(value)))}</div>
            <div class="highlight-field">${this._selector("Chi\u1EC1u cao tile", { number: { min: 84, max: 280, mode: "box" } }, this._config.tile_height ?? "", (value) => this._updateRoot("tile_height", value === "" ? void 0 : Number(value)))}</div>
            ${this._selector("Th\xF4ng tin ph\u1EE5", { select: { mode: "dropdown", options: this._options(["last-changed", "state", "none"]) } }, this._config.secondary_info || DEFAULT_CONFIG.secondary_info, (value) => this._updateRoot("secondary_info", value))}
            ${this._selector("M\xE0u n\u1EC1n", { text: {} }, this._config.background ?? "", (value) => this._updateRoot("background", value || void 0))}
            ${this._selector("M\xE0u b\u1EC1 m\u1EB7t tile", { text: {} }, this._config.surface_color ?? "", (value) => this._updateRoot("surface_color", value || void 0))}
            ${this._selector("M\xE0u vi\u1EC1n tile", { text: {} }, this._config.border_color ?? "", (value) => this._updateRoot("border_color", value || void 0))}
            ${this._selector("M\xE0u accent m\u1EB7c \u0111\u1ECBnh", { text: {} }, this._config.accent_color ?? "", (value) => this._updateRoot("accent_color", value || void 0))}
            ${this._selector("M\xE0u ch\u1EEF ch\xEDnh", { text: {} }, this._config.text_color ?? "", (value) => this._updateRoot("text_color", value || void 0))}
            ${this._selector("M\xE0u ch\u1EEF ph\u1EE5", { text: {} }, this._config.muted_text_color ?? "", (value) => this._updateRoot("muted_text_color", value || void 0))}
            ${this._selector("M\xE0u state", { text: {} }, this._config.state_text_color ?? "", (value) => this._updateRoot("state_text_color", value || void 0))}
            ${this._selector("M\xE0u n\u1EC1n tab bar", { text: {} }, this._config.tab_background_color ?? "", (value) => this._updateRoot("tab_background_color", value || void 0))}
          </div>
          <div class="hint">Bạn có thể để trống các ô số ở cấu hình chung để card tự dùng giá trị mặc định lúc render.</div>
        </div>

        ${this._config.rooms.map((room, roomIndex) => this._renderRoom(roomIndex))}

        <div class="actions">
          <button @click=${this._addRoom}>+ Thêm room</button>
        </div>
      </div>
    `;
  }
  _renderRoom(roomIndex) {
    const room = this._config.rooms[roomIndex];
    return b2`
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title">Room ${roomIndex + 1}</div>
          <button class="secondary" @click=${() => this._removeRoom(roomIndex)}>Xóa room</button>
        </div>

        <div class="grid">
          ${this._selector("T\xEAn room", { text: {} }, room.title, (value) => this._updateRoom(roomIndex, "title", value))}
          ${this._selector("M\xE0u header", { text: {} }, room.accent_color || DEFAULT_ROOM.accent_color || "", (value) => this._updateRoom(roomIndex, "accent_color", value))}
          ${this._selector("Layout ri\xEAng", { select: { mode: "dropdown", options: [{ value: "", label: "Theo card" }, ...this._options(["scroll", "grid"])] } }, room.layout || "", (value) => this._updateRoom(roomIndex, "layout", value || void 0))}
          ${this._selector("S\u1ED1 c\u1ED9t ri\xEAng", { number: { min: 1, max: 6, mode: "box" } }, room.columns ?? "", (value) => this._updateRoom(roomIndex, "columns", value === "" ? void 0 : Number(value)))}
          ${this._selector("\u0110\u1ED9 r\u1ED9ng tile ri\xEAng", { number: { min: 160, max: 340, mode: "box" } }, room.tile_width ?? "", (value) => this._updateRoom(roomIndex, "tile_width", value === "" ? void 0 : Number(value)))}
          ${this._selector("Chi\u1EC1u cao tile ri\xEAng", { number: { min: 84, max: 280, mode: "box" } }, room.tile_height ?? "", (value) => this._updateRoom(roomIndex, "tile_height", value === "" ? void 0 : Number(value)))}
        </div>

        <div class="hint">Card dùng schema rooms[].items[] để giảm trùng lặp và dễ maintain hơn.</div>

        <div class="stack">
          ${room.items.map((_2, itemIndex) => this._renderItem(roomIndex, itemIndex))}
        </div>

        <div class="actions">
          <button @click=${() => this._addItem(roomIndex)}>+ Thêm item</button>
        </div>
      </div>
    `;
  }
  _renderItem(roomIndex, itemIndex) {
    const items = this._config.rooms[roomIndex].items;
    const item = items[itemIndex];
    const isFirst = itemIndex === 0;
    const isLast = itemIndex === items.length - 1;
    return b2`
      <div class="item-card">
        <div class="panel-head">
          <div class="panel-title">Item ${itemIndex + 1}</div>
          <div class="panel-actions">
            <button
              class="secondary small"
              ?disabled=${isFirst}
              @click=${() => this._moveItem(roomIndex, itemIndex, -1)}
            >
              Lên
            </button>
            <button
              class="secondary small"
              ?disabled=${isLast}
              @click=${() => this._moveItem(roomIndex, itemIndex, 1)}
            >
              Xuống
            </button>
            <button class="secondary" @click=${() => this._removeItem(roomIndex, itemIndex)}>Xóa item</button>
          </div>
        </div>

        <div class="grid">
          ${this._selector("Entity", { entity: {} }, item.entity, (value) => this._updateItem(roomIndex, itemIndex, "entity", value))}
          ${this._selector("T\xEAn hi\u1EC3n th\u1ECB", { text: {} }, item.name || "", (value) => this._updateItem(roomIndex, itemIndex, "name", value || void 0))}
          ${this._selector("Icon", { icon: {} }, item.icon || "", (value) => this._updateItem(roomIndex, itemIndex, "icon", value || void 0))}
          ${this._selector("Th\xF4ng tin ph\u1EE5", { select: { mode: "dropdown", options: [{ value: "", label: "Theo card" }, ...this._options(["last-changed", "state", "none"])] } }, item.secondary_info || "", (value) => this._updateItem(roomIndex, itemIndex, "secondary_info", value || void 0))}
        </div>

        ${this._renderActionEditor(roomIndex, itemIndex, "tap_action", "Tap action")}
        ${this._renderActionEditor(roomIndex, itemIndex, "hold_action", "Hold action")}
        ${this._renderActionEditor(roomIndex, itemIndex, "double_tap_action", "Double tap action")}
      </div>
    `;
  }
  _renderActionEditor(roomIndex, itemIndex, slot, label) {
    const item = this._config.rooms[roomIndex].items[itemIndex];
    const action = item[slot];
    const kind = action?.action || (slot === "tap_action" ? "toggle" : "none");
    return b2`
      <details ?open=${slot === "tap_action"}>
        <summary>${label}</summary>
        <div class="stack">
          ${this._selector("Lo\u1EA1i action", { select: { mode: "dropdown", options: this._options(["toggle", "more-info", "navigate", "url", "call-service", "none"]) } }, kind, (value) => this._updateAction(roomIndex, itemIndex, slot, "action", value))}
          ${kind === "navigate" ? this._selector("Navigation path", { text: {} }, action?.navigation_path || "", (value) => this._updateAction(roomIndex, itemIndex, slot, "navigation_path", value)) : A}
          ${kind === "url" ? b2`
                <div class="grid">
                  ${this._selector("URL", { text: {} }, action?.url_path || "", (value) => this._updateAction(roomIndex, itemIndex, slot, "url_path", value))}
                  ${this._selector("Target", { select: { mode: "dropdown", options: this._options(["_blank", "_self"]) } }, action?.url_target || "_blank", (value) => this._updateAction(roomIndex, itemIndex, slot, "url_target", value))}
                </div>
              ` : A}
          ${kind === "call-service" ? b2`
                <div class="grid">
                  ${this._selector("Service", { text: {} }, action?.service || "", (value) => this._updateAction(roomIndex, itemIndex, slot, "service", value))}
                  ${this._selector("Target entity_id", { entity: { multiple: false } }, action?.target?.entity_id || "", (value) => this._updateAction(roomIndex, itemIndex, slot, "target.entity_id", value || void 0))}
                  ${this._selector("Target area_id", { text: {} }, action?.target?.area_id || "", (value) => this._updateAction(roomIndex, itemIndex, slot, "target.area_id", value || void 0))}
                  ${this._selector("Target device_id", { text: {} }, action?.target?.device_id || "", (value) => this._updateAction(roomIndex, itemIndex, slot, "target.device_id", value || void 0))}
                </div>
                ${this._selector("Service data", { object: {} }, action?.service_data || {}, (value) => this._updateAction(roomIndex, itemIndex, slot, "service_data", value || void 0))}
              ` : A}
        </div>
      </details>
    `;
  }
  _selector(label, selector, value, callback) {
    return b2`
      <ha-selector
        .hass=${this.hass}
        .label=${label}
        .selector=${selector}
        .value=${value}
        @value-changed=${(event) => callback(event.detail.value)}
      ></ha-selector>
    `;
  }
  _options(values) {
    return values.map((value) => ({ value, label: value }));
  }
  _removeRoom(roomIndex) {
    const rooms = this._config.rooms.filter((_2, index) => index !== roomIndex);
    this._config = this._prepareEditorConfig({
      ...this._config,
      rooms: rooms.length ? rooms : [ensureRoom()]
    });
    this._emitConfig();
  }
  _addItem(roomIndex) {
    const rooms = [...this._config.rooms];
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      items: [...rooms[roomIndex].items, ensureItem()]
    };
    this._config = this._prepareEditorConfig({ ...this._config, rooms });
    this._emitConfig();
  }
  _removeItem(roomIndex, itemIndex) {
    const rooms = [...this._config.rooms];
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      items: rooms[roomIndex].items.filter((_2, index) => index !== itemIndex)
    };
    this._config = this._prepareEditorConfig({ ...this._config, rooms });
    this._emitConfig();
  }
  _moveItem(roomIndex, itemIndex, step) {
    const rooms = [...this._config.rooms];
    const items = [...rooms[roomIndex].items];
    const nextIndex = itemIndex + step;
    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }
    const [moved] = items.splice(itemIndex, 1);
    items.splice(nextIndex, 0, moved);
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      items
    };
    this._config = this._prepareEditorConfig({ ...this._config, rooms });
    this._emitConfig();
  }
  _updateRoot(key, value) {
    this._config = this._prepareEditorConfig({
      ...this._config,
      [key]: value
    });
    this._emitConfig();
  }
  _updateRoom(roomIndex, key, value) {
    const rooms = [...this._config.rooms];
    const room = { ...rooms[roomIndex], [key]: value };
    rooms[roomIndex] = room;
    this._config = this._prepareEditorConfig({ ...this._config, rooms });
    this._emitConfig();
  }
  _updateItem(roomIndex, itemIndex, key, value) {
    const rooms = [...this._config.rooms];
    const items = [...rooms[roomIndex].items];
    items[itemIndex] = ensureItem({
      ...items[itemIndex],
      [key]: value
    });
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      items
    };
    this._config = this._prepareEditorConfig({ ...this._config, rooms });
    this._emitConfig();
  }
  _updateAction(roomIndex, itemIndex, slot, path, value) {
    const rooms = [...this._config.rooms];
    const items = [...rooms[roomIndex].items];
    const nextItem = ensureItem(items[itemIndex]);
    const currentAction = { ...nextItem[slot] || { action: slot === "tap_action" ? "toggle" : "none" } };
    this._setNestedValue(currentAction, path, value);
    nextItem[slot] = currentAction;
    if (path === "action" && value === "none" && slot !== "tap_action") {
      delete nextItem[slot];
    }
    if (path === "action" && value === "none" && slot === "tap_action") {
      nextItem[slot] = { action: "none" };
    }
    items[itemIndex] = nextItem;
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      items
    };
    this._config = this._prepareEditorConfig({ ...this._config, rooms });
    this._emitConfig();
  }
  _prepareEditorConfig(config) {
    if (!config?.rooms?.length) {
      return createStubConfig();
    }
    return {
      type: config.type || `custom:${CARD_TYPE}`,
      theme: config.theme,
      room_display: config.room_display,
      layout: config.layout,
      columns: config.columns,
      tile_width: config.tile_width,
      tile_height: config.tile_height,
      secondary_info: config.secondary_info,
      background: config.background,
      surface_color: config.surface_color,
      border_color: config.border_color,
      accent_color: config.accent_color,
      text_color: config.text_color,
      muted_text_color: config.muted_text_color,
      state_text_color: config.state_text_color,
      tab_background_color: config.tab_background_color,
      rooms: config.rooms.map((room) => {
        const sourceItems = (room.items?.length ? room.items : room.entities) || [];
        const nextRoom = ensureRoom({
          ...room,
          items: sourceItems.map((item) => ensureItem(item))
        });
        return {
          ...nextRoom,
          layout: room.layout,
          columns: room.columns,
          tile_width: room.tile_width,
          tile_height: room.tile_height,
          items: sourceItems.map((item) => ensureItem(item))
        };
      })
    };
  }
  _setNestedValue(target, path, value) {
    const segments = path.split(".");
    const last = segments.pop();
    if (!last) {
      return;
    }
    let current = target;
    for (const segment of segments) {
      if (!current[segment] || typeof current[segment] !== "object") {
        current[segment] = {};
      }
      current = current[segment];
    }
    if (value === void 0 || value === "") {
      delete current[last];
      return;
    }
    current[last] = value;
  }
  _emitConfig() {
    const clean = cleanConfig(this._config);
    fireEvent(this, "config-changed", { config: clean });
  }
};
SoftRoomCardEditor.properties = {
  hass: { attribute: false },
  _config: { state: true }
};
SoftRoomCardEditor.styles = i`
    :host {
      display: block;
      color: var(--primary-text-color);
    }

    .editor {
      display: grid;
      gap: 18px;
      padding-top: 8px;
    }

    .panel,
    .item-card {
      border: 1px solid var(--divider-color);
      border-radius: 18px;
      padding: 16px;
      display: grid;
      gap: 14px;
      background: var(--card-background-color, rgba(255, 255, 255, 0.04));
    }

    .panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .panel-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 700;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .stack {
      display: grid;
      gap: 12px;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    button {
      border: none;
      border-radius: 999px;
      padding: 10px 14px;
      background: var(--primary-color);
      color: #fff;
      cursor: pointer;
      font: inherit;
      font-weight: 600;
    }

    button.secondary {
      background: rgba(127, 127, 127, 0.18);
      color: var(--primary-text-color);
    }

    button.small {
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 600;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    details {
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      padding: 12px;
      background: rgba(127, 127, 127, 0.04);
    }

    summary {
      cursor: pointer;
      font-weight: 700;
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .hint {
      font-size: 13px;
      color: var(--secondary-text-color);
    }

    .highlight-field {
      background: rgba(0, 153, 255, 0.12);
      border: 1px solid rgba(0, 153, 255, 0.3);
      border-radius: 12px;
      padding: 8px;
    }

    ha-selector {
      display: block;
    }

    @media (max-width: 640px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;
customElements.define(`${CARD_TYPE}-editor`, SoftRoomCardEditor);

// src/index.ts
console.info(
  `%c ${CARD_NAME} %c ${CARD_VERSION} `,
  "color: white; background: #eb3e7c; font-weight: 700;",
  "color: #eb3e7c; background: white; font-weight: 700;"
);
