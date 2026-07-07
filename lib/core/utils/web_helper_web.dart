import 'dart:js' as js;

void openWindow(String url) {
  js.context.callMethod('open', [url]);
}
