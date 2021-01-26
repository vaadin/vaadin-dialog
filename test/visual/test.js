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

  const locator = 'body[data-ready]';

  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('dialog');
    });

    it(`${theme}-no-padding`, function() {
      return this.browser
        .url(`no-padding.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-no-padding`, locator);
    });
  });

});
