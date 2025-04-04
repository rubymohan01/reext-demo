Ext.define('Ext.d3.Component.O', {
  override: 'Ext.d3.Component',
  extend: 'Ext.d3.ComponentBase', 
  requires: ['Ext.d3.lib.d3'],
  isD3: true,
  config: {
    store: null, 
    componentCls: '', 
    interactions: [], 
    transitions: { none: { name: undefined, duration: 0, ease: Ext.identityFn } },
    touchAction: { panX: false, panY: false, pinchZoom: false, doubleTapZoom: false }
  },
  baseCls: Ext.baseCSSPrefix + 'd3', 
  defaultBindProperty: 'store', 
  isInitializing: true, 
  refreshDelay: 100, resizeDelay: 250, resizeTimerId: 0, 
  size: null, d3Components: null,

  constructor: function (config) {
    var me = this;
    me.d3Components = {};
    me.callParent(arguments);
    me.isInitializing = false;
    me.on('resize', 'onElementResize', me);
    me.on('widthchange', 'onElementResize', me);
  },

  destroy: function () {
    var me = this;
    if (me.resizeTimerId) {
      clearTimeout(me.resizeTimerId);
    }
    me.un('resize', 'onElementResize', me);
    me.setInteractions();
    me.callParent();
  }, updateComponentCls: function (componentCls, oldComponentCls) {
    var baseCls = this.baseCls, el = this.element;
    if (componentCls && Ext.isString(componentCls)) {
      el.addCls(componentCls, baseCls);
      if (oldComponentCls) {
        el.removeCls(oldComponentCls, baseCls);
      }
    }
  },

  register: function (component) {
    var map = this.d3Components, id = component.getId();
    if (id === undefined) {
      Ext.raise('Attempting to register a component with no ID.');
    }
    if (id in map) {
      Ext.raise('Component with ID "' + id + '" is already registered.');
    }
    map[id] = component;
  },

  unregister: function (component) {
    var map = this.d3Components, id = component.getId();
    delete map[id];
  },

  applyInteractions: function (interactions, oldInteractions) {
    if (!oldInteractions) {
      oldInteractions = [];
      oldInteractions.map = {};
    }
    var me = this, result = [], oldMap = oldInteractions.map, i, ln, interaction, id;
    result.map = {};
    interactions = Ext.Array.from(interactions, true);
    for (i = 0, ln = interactions.length; i < ln; i++) {
      interaction = interactions[i];
      if (!interaction) {
        continue;
      }
      if (interaction.isInteraction) {
        id = interaction.getId();
      } else {
        id = interaction.id;
        interaction.element = me.element;
      }
      interaction = Ext.factory(interaction, null, oldMap[id], 'd3.interaction');
      if (interaction) {
        interaction.setComponent(me);
        me.addInteraction(interaction);
        result.push(interaction);
        result.map[interaction.getId()] = interaction;
      }
    }
    for (i in oldMap) {
      if (!result.map[i]) {
        interaction = oldMap[i];
        interaction.destroy();
      }
    }
    return result;
  },

  applyTransitions: function (transitions) {
    var name, transition, ease, ret = {};
    for (name in transitions) {
      transition = transitions[name];
      if (transition === true) {
        Ext.raise("'true' is not a valid transition value (should be an object or 'false').");
      }
      ret[name] = transition = Ext.apply({}, transition || transitions.none);
      ease = transition.ease;
      if (typeof ease === 'string') {
        transition.ease = d3['ease' + ease.charAt(0).toUpperCase() + ease.substr(1)];
      }
      if (!('name' in transition)) {
        transition.name = this.getId() + '-' + name;
      }
    }
    return ret;
  },

  createTransition: function (name, selection) {
    var transition = this.getTransitions()[name];
    if (!transition) {
      Ext.raise('No transition named "' + name + '"');
    }
    if (!selection) {
      selection = d3;
    }
    return selection.transition(transition.name).ease(transition.ease).duration(transition.duration);
  },

  panZoom: null, onPanZoom: Ext.emptyFn, getContentRect: Ext.emptyFn, getViewportRect: Ext.emptyFn, addInteraction: function (interaction) {
    var me = this;
    if (interaction.isPanZoom) {
      interaction.setContentRect(me.getContentRect.bind(me));
      interaction.setViewportRect(me.getViewportRect.bind(me));
      me.panZoom = interaction;
      interaction.on('panzoom', me.onPanZoom, me);
    }
    interaction.on('destroy', me.onInteractionDestroy, me);
  },

  removeInteraction: function (interaction) {
    if (interaction.isPanZoom) {
      interaction.setContentRect(null);
      interaction.setViewportRect(null);
      this.panZoom = null;
      interaction.un('panzoom', this.onPanZoom, this);
    }
  },

  onInteractionDestroy: function (interaction) {
    interaction.un('destroy', this.onInteractionDestroy, this);
    this.removeInteraction(interaction);
  }, applyStore: function (store) {
    return store && Ext.StoreManager.lookup(store);
  }, updateStore: function (store, oldStore) {
    var me = this, storeEvents = { datachanged: 'onDataChange', buffer: me.refreshDelay, scope: me, order: 'after' }, root;
    if (oldStore) {
      oldStore.un(storeEvents);
      if (oldStore.getAutoDestroy()) {
        oldStore.destroy();
      }
    }
    if (store) {
      store.on(storeEvents);
      if (store.isTreeStore) {
        root = store.getRoot();
        if (!root.isExpanded()) {
          store.suspendEvent('datachanged');
          root.on({
            expand: function () {
              store.resumeEvent('datachanged');
              store.fireEvent('datachanged', store);
            }, single: true
          });
        }
      }
    }
    me.onDataChange(store);
  },

  onDataChange: function (store) {
    var me = this;
    if (me.isInitializing) {
      return;
    }
    me.processDataChange(store);
  },

  onDataUpdate: function (store, record, operation, modifiedFieldNames, details) {
    var me = this;
    if (me.isInitializing) {
      return;
    }
    me.processDataUpdate(store, record, operation, modifiedFieldNames, details);
  },

  onDataLoad: function (store, records, successful, operation) {
    this.processDataLoad(store, records, successful, operation);
  },

  processDataChange: Ext.emptyFn, processDataUpdate: Ext.emptyFn, processDataLoad: Ext.emptyFn, maskEl: null, showMask: function (msg) {
    var me = this;
    if (me.maskEl) {
      me.maskEl.dom.firstChild.textContent = msg;
      me.maskEl.setStyle('display', 'flex');
    } else {
      me.maskEl = this.element.createChild({ style: { position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', left: 0, top: 0, bottom: 0, right: 0, background: 'rgba(0,0,0,0.5)' }, children: [{ html: msg, style: { background: 'rgba(0,0,0,0.8)', color: 'white', fontWeight: 'bold', borderRadius: '10px', padding: '10px' } }] });
    }
  },

  hideMask: function () {
    if (this.maskEl) {
      this.maskEl.setStyle('display', 'none');
    }
  },

  handleResize: function (size, instantly) {
    //console.log('handleResize')
    var me = this, el = me.element;
    //size = size || el && el.getSize();
    // console.log('me', me)
    // console.log('element', el)
    // console.log('size before', size)
    // console.log('el.getSize()', el.getSize())
    // console.log('size', size)
    // console.log('size.width', size.width)
    // console.log('size.height', size.height)
    // console.log('instantly', instantly)
    // console.log('me.resizeTimerId', me.resizeTimerId)
    // console.log('me.resizeDelay', me.resizeDelay)
    var size2 = el.getSize();
    if (!(size2 && size2.width && size2.height)) {
      return;
    }
    clearTimeout(me.resizeTimerId);
    if (instantly) {
      me.resizeTimerId = 0;
    } else {
      me.resizeTimerId = Ext.defer(me.handleResize, me.resizeDelay, me, [size2, true]);
      return;
    }
    me.resizeHandler(size2);
    if (me.panZoom && me.panZoom.updateIndicator) {
      me.panZoom.updateIndicator();
    }
    me.size = size2;
  },

  resizeHandler: Ext.emptyFn,

  toLocalXY: function (event, view) {
    var pageXY = event.getXY(), viewXY = view ? view.getXY() : this.element.getXY();
    return [pageXY[0] - viewXY[0], pageXY[1] - viewXY[1]];
  }
});
