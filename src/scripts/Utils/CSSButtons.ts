export type CSSButtonConfig = {
    id: string,
    value: string,
    onClick: Function,
    parent: HTMLElement,
    class?: string
}

export type CSSButtonStyle = {
    get: (config: CSSButtonConfig) => string,
    src: string
}

export const CSSButtons = {
    cyber: {
        get: (config: CSSButtonConfig) => `<button id='${config.id}' class='cybr-btn' type='button' value='' style="content:'${config.value}';"><span aria-hidden class="cybr-btn__glitch">${config.value}</span></button>`,
        src: 'assets/css/buttons/cyber.css'
    },
    simple: {
        get: (config: CSSButtonConfig) => `<a href="#">Hover Me</a>`,
        src: 'assets/css/buttons/simple.scss'
    },
    test: {
        get: (config: CSSButtonConfig) => `<div id:'${config.id}' value = "${config.value}" content="1231" style:"content: 'HOVER ME';" class="button">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        ${config.value}
      </div>`,
        src: 'assets/css/buttons/test.scss'
    },
    bn54: {
        get: (config: CSSButtonConfig) => `<div id=${config.id}>
        <button class="bn54">
          <span class="bn54span"><u>${config.value}</u></span>
        </button>
      </div>`,
        src: 'assets/css/buttons/bn54.css'
    },
    // simple: {
    //     get: (config: CSSButtonConfig) => `<button id='${config.id}' class='btn' type='button' value='' style="content:'${config.value}';">${config.value}</button>`,
    //     src: 'assets/css/buttons/simple.scss'
    // },
}