/* eslint-disable no-alert, no-param-reassign, no-underscore-dangle */

const HELP = `
You can use the mouse to drag attractors around.
Alt/Cmd-click them to toggle their polarity.

MIT license – github.com/akx/ellip
`;

const el = (tag, attrs = {}, content = []) => {
  const element = Object.assign(document.createElement(tag), attrs);
  Array.from(content).forEach((child) => {
    if (typeof child !== 'object') {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  });
  return element;
};


function labeledCheckbox(label, box) {
  return el('label', {}, [
    el('input', {
      type: 'checkbox',
      checked: box(),
      onchange(e) {
        box(e.target.checked);
        return false;
      },
    }),
    label,
  ]);
}

function optionBox(app, key, clearNext = false) {
  return (value) => {
    if (value !== undefined) {
      app.options[key] = value;
      if (clearNext) {
        app.clearNext = true;
      }
    }
    return app.options[key];
  };
}


export default class EllipUi {
  constructor(app) {
    this.app = app;
    this.attractorsOptionBox = optionBox(this.app, 'drawAttractors');
    this.mirrorXOptionBox = optionBox(this.app, 'mirrorX', true);
    this.mirrorYOptionBox = optionBox(this.app, 'mirrorY', true);
    this.elements = [
      el('a', {
        href: '#',
        onclick() {
          alert(HELP);
        },
      }, 'help'),
      labeledCheckbox('attractors', this.attractorsOptionBox),
      labeledCheckbox('mirror x', this.mirrorXOptionBox),
      labeledCheckbox('mirror y', this.mirrorYOptionBox),
      el('button', {
        onclick() {
          app.generator.randomizeEllipse();
          app.clearNext = true;
        },
      }, 'random ellipse'),
      el('button', {
        onclick() {
          app.generator.randomizeAttractors(2, 15);
          app.clearNext = true;
        },
      }, 'random attractors'),
      el('button', {
        onclick() {
          app.generateGradient();
          app.clearNext = true;
        },
      }, 'random gradient'),
      el('button', {
        onclick() {
          const stateJSON = JSON.stringify(app.generator.toState());
          const newStateJSON = prompt('Copy/paste state here', stateJSON);
          if (newStateJSON && newStateJSON !== stateJSON) {
            try {
              const newState = JSON.parse(newStateJSON);
              app.generator.fromState(newState);
            } catch (e) {
              alert(e);
            }
          }
          app.clearNext = true;
        },
      }, 'import/export state'),
    ];
  }

  mount(el) {
    this.elements.forEach((kid) => {
      el.appendChild(kid);
    });
  }
}
