import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:image_picker/image_picker.dart';
// ignore: depend_on_referenced_packages
import 'package:webview_flutter_android/webview_flutter_android.dart';

class AdminBrowserScreen extends StatefulWidget {
  final String url;
  const AdminBrowserScreen({super.key, required this.url});

  @override
  State<AdminBrowserScreen> createState() => _AdminBrowserScreenState();
}

class _AdminBrowserScreenState extends State<AdminBrowserScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;
  double _progress = 0;
  String _currentTitle = 'Admin Panel';

  @override
  void initState() {
    super.initState();

    late final PlatformWebViewControllerCreationParams params;
    if (WebViewPlatform.instance is AndroidWebViewPlatform) {
      params = AndroidWebViewControllerCreationParams();
    } else {
      params = const PlatformWebViewControllerCreationParams();
    }

    _controller = WebViewController.fromPlatformCreationParams(params)
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            if (mounted) {
              setState(() {
                _progress = progress / 100.0;
              });
            }
          },
          onPageStarted: (String url) {
            if (mounted) {
              setState(() {
                _isLoading = true;
              });
            }
          },
          onPageFinished: (String url) {
            if (mounted) {
              setState(() {
                _isLoading = false;
              });
            }
            _updateTitle();
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('Webview Resource Error: ${error.description}');
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.url));

    if (_controller.platform is AndroidWebViewController) {
      AndroidWebViewController.enableDebugging(true);
      (_controller.platform as AndroidWebViewController)
          .setOnShowFileSelector((FileSelectorParams params) async {
        final picker = ImagePicker();
        
        // Handle multiple files if accept multiple
        if (params.acceptTypes.any((type) => type.contains('image'))) {
            if (params.mode == FileSelectorMode.openMultiple) {
                final List<XFile> photos = await picker.pickMultiImage();
                return photos.map((photo) => Uri.file(photo.path).toString()).toList();
            } else {
                final photo = await picker.pickImage(source: ImageSource.gallery);
                if (photo != null) {
                    return [Uri.file(photo.path).toString()];
                }
            }
        } else {
            // fallback
            final photo = await picker.pickImage(source: ImageSource.gallery);
            if (photo != null) {
                return [Uri.file(photo.path).toString()];
            }
        }
        return [];
      });
    }
  }

  Future<void> _updateTitle() async {
    try {
      final title = await _controller.getTitle();
      if (mounted && title != null && title.isNotEmpty) {
        setState(() {
          _currentTitle = title;
        });
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _currentTitle,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text(
              widget.url,
              style: TextStyle(fontSize: 10, color: isDark ? Colors.white54 : Colors.black54),
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
        elevation: 0,
        backgroundColor: isDark ? Colors.grey[900] : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black87,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Segarkan Halaman',
            onPressed: () => _controller.reload(),
          ),
          IconButton(
            icon: const Icon(Icons.home_rounded),
            tooltip: 'Halaman Utama',
            onPressed: () => _controller.loadRequest(Uri.parse(widget.url)),
          ),
        ],
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_isLoading)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: PreferredSize(
                preferredSize: const Size.fromHeight(4.0),
                child: LinearProgressIndicator(
                  value: _progress > 0 ? _progress : null,
                  backgroundColor: Colors.transparent,
                  valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                  minHeight: 3.5,
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: Container(
        height: 56,
        decoration: BoxDecoration(
          color: isDark ? Colors.grey[900] : Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              FutureBuilder<bool>(
                future: _controller.canGoBack(),
                builder: (context, snapshot) {
                  final canGoBack = snapshot.data ?? false;
                  return IconButton(
                    icon: const Icon(Icons.arrow_back_ios_rounded),
                    color: canGoBack ? theme.colorScheme.primary : Colors.grey,
                    onPressed: canGoBack ? () => _controller.goBack() : null,
                  );
                },
              ),
              FutureBuilder<bool>(
                future: _controller.canGoForward(),
                builder: (context, snapshot) {
                  final canGoForward = snapshot.data ?? false;
                  return IconButton(
                    icon: const Icon(Icons.arrow_forward_ios_rounded),
                    color: canGoForward ? theme.colorScheme.primary : Colors.grey,
                    onPressed: canGoForward ? () => _controller.goForward() : null,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
