const createCustomTitlebar = () => {
  const {Titlebar, Color} = require('custom-electron-titlebar');

  new Titlebar({
    backgroundColor: Color.fromHex('#ffffff'),
    drag: true,
    minimizable: true,
    maximizable: true,
    closeable: true,
    menu: null,
    titleHorizontalAlignment: 'left',
  });
};

createCustomTitlebar();
