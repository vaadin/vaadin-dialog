gemini.suite('vaadin-dialog', function(rootSuite) {
  function wait(actions, find) {
    actions.wait(5000);
  }

  function goToAboutBlank(actions, find) {
    // Firefox stops responding on socket after a test, workaround:
    return actions.executeJS(function(window) {
      window.location.href = 'about:blank'; // just go away, please!
    });
  }

  rootSuite
    .before(wait)
    .after(goToAboutBlank);

  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('dialog');
    });

    gemini.suite(`${theme}-no-padding`, function(suite) {
      suite
        .setUrl(`no-padding.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture(`dialog`);
    });
  });

});
