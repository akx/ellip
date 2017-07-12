/* eslint-disable no-alert, no-param-reassign */
import m from 'mithril/hyperscript';
import mount from 'mithril/mount';

const HELP = `
You can use the mouse to drag attractors around.
Alt/Cmd-click them to toggle their polarity.

MIT license – github.com/akx/ellip
`;


function labeledCheckbox(label, box) {
  return m('label', [
    m('input[type=checkbox]', {
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
  }


  view() {
    const {app} = this;
    return [
      m('a', {
        href: '#',
        onclick() {
          alert(HELP);
        },
      }, 'help'),
      labeledCheckbox('attractors', this.attractorsOptionBox),
      labeledCheckbox('mirror x', this.mirrorXOptionBox),
      labeledCheckbox('mirror y', this.mirrorYOptionBox),
      m('button', {
        onclick() {
          app.generator.randomizeEllipse();
          app.clearNext = true;
        },
      }, 'random ellipse'),
      m('button', {
        onclick() {
          app.generator.randomizeAttractors(2, 15);
          app.clearNext = true;
        },
      }, 'random attractors'),
      m('button', {
        onclick() {
          app.generateGradient();
          app.clearNext = true;
        },
      }, 'random gradient'),
      m('button', {
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
    mount(el, this);
  }
}
