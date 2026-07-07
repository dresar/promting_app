import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/data/repositories/app_options_repository.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:promting_app/providers/category_provider.dart';
import 'package:promting_app/providers/settings_provider.dart';
import 'package:promting_app/widgets/custom_button.dart';
import 'package:promting_app/widgets/custom_textfield.dart';
import 'package:promting_app/widgets/toast_message.dart';
import 'package:promting_app/providers/auth_provider.dart';
class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // AI Key Section
  final _newKeyController = TextEditingController();
  List<Map<String, dynamic>> _groqKeys = [];
  bool _isLoadingKeys = true;

  // Kategori Section
  final _newCategoryController = TextEditingController();

  // Audiens Section
  final _newAudienceController = TextEditingController();
  List<TargetAudience> _audiences = [];

  // Design Style Section
  final _newStyleController = TextEditingController();
  final _newStylePromptController = TextEditingController();
  final _newStyleImageUrlController = TextEditingController();
  List<DesignStyle> _designStyles = [];



  // Profil Section
  final _profileFormKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isUpdatingProfile = false;


  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
    _loadAll();
  }


  Future<void> _loadAll() async {
    setState(() {
      _isLoadingKeys = true;
    });

    final repo = ref.read(appOptionsRepositoryProvider);
    final keys = await repo.getGroqApiKeys();
    final audiences = await repo.getTargetAudiences();
    final styles = await repo.getDesignStyles();


    if (mounted) {
      final authState = ref.read(authProvider);
      if (authState.user != null) {
        _nameController.text = authState.user!.name;
      }
      setState(() {
        _groqKeys = keys;
        _audiences = audiences;
        _designStyles = styles;
        _isLoadingKeys = false;
      });
    }
  }

  // ─── Profile Actions ──────────────────────────────────────────────────────

  Future<void> _updateProfile() async {
    if (!_profileFormKey.currentState!.validate()) return;
    
    setState(() => _isUpdatingProfile = true);
    try {
      final repo = ref.read(userRepositoryProvider);
      if (_passwordController.text.isNotEmpty) {
        await repo.changePassword('INDAH1234', _passwordController.text);
      }
      

      final newProfile = await repo.updateProfile(
        _nameController.text.trim(), 
        ref.read(authProvider).user?.avatarUrl
      );
      ref.read(authProvider.notifier).updateLocalProfile(newProfile);
      
      if (mounted) {
        ToastMessage.showSuccess(context, 'Profil berhasil diperbarui!');
      }
    } catch (e) {
      if (mounted) ToastMessage.showError(context, e.toString());
    } finally {
      if (mounted) setState(() => _isUpdatingProfile = false);
    }
  }

  void _logout() {
    ref.read(authProvider.notifier).logout();
  }

  // ─── Groq Key Actions ────────────────────────────────────────────────────

  Future<void> _addGroqKey() async {
    final key = _newKeyController.text.trim();
    if (key.isEmpty) return;
    try {
      final repo = ref.read(appOptionsRepositoryProvider);
      await repo.addGroqApiKey(key);
      _newKeyController.clear();
      final refreshed = await repo.getGroqApiKeys();
      setState(() => _groqKeys = refreshed);
      if (mounted) ToastMessage.showSuccess(context, 'API Key berhasil ditambahkan!');
    } catch (e) {
      if (mounted) ToastMessage.showError(context, e.toString());
    }
  }

  Future<void> _deleteGroqKey(String id) async {
    try {
      final repo = ref.read(appOptionsRepositoryProvider);
      await repo.deleteGroqApiKey(id);
      final refreshed = await repo.getGroqApiKeys();
      setState(() => _groqKeys = refreshed);
      if (mounted) ToastMessage.showSuccess(context, 'API Key dihapus.');
    } catch (e) {
      if (mounted) ToastMessage.showError(context, e.toString());
    }
  }

  Future<void> _resetKeyErrors(String id) async {
    try {
      final repo = ref.read(appOptionsRepositoryProvider);
      await repo.resetGroqApiKeyErrors(id);
      final refreshed = await repo.getGroqApiKeys();
      setState(() => _groqKeys = refreshed);
      if (mounted) ToastMessage.showSuccess(context, 'Error count direset.');
    } catch (e) {
      if (mounted) ToastMessage.showError(context, e.toString());
    }
  }

  // ─── Category Actions ─────────────────────────────────────────────────────

  Future<void> _addCategory() async {
    final name = _newCategoryController.text.trim();
    if (name.isEmpty) return;
    final ok = await ref.read(categoryProvider.notifier).createCategory(name: name);
    _newCategoryController.clear();
    if (mounted) {
      if (ok) {
        ToastMessage.showSuccess(context, 'Kategori "$name" ditambahkan!');
      } else {
        ToastMessage.showError(context, 'Gagal menambahkan kategori.');
      }
    }
  }

  Future<void> _deleteCategory(String id) async {
    try {
      await ref.read(categoryProvider.notifier).deleteCategory(id);
      if (mounted) ToastMessage.showSuccess(context, 'Kategori dihapus.');
    } catch (e) {
      if (mounted) ToastMessage.showError(context, e.toString());
    }
  }

  // ─── Audience Actions ─────────────────────────────────────────────────────

  Future<void> _addAudience() async {
    final name = _newAudienceController.text.trim();
    if (name.isEmpty) return;
    try {
      final repo = ref.read(appOptionsRepositoryProvider);
      await repo.createTargetAudience(name);
      _newAudienceController.clear();
      final refreshed = await repo.getTargetAudiences();
      setState(() => _audiences = refreshed);
      if (mounted) ToastMessage.showSuccess(context, 'Audiens "$name" ditambahkan!');
    } catch (e) {
      if (mounted) ToastMessage.showError(context, e.toString());
    }
  }

  Future<void> _showAddAudienceDialog() async {
    _newAudienceController.clear();
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Tambah Audiens Baru'),
        content: TextField(
          controller: _newAudienceController,
          decoration: const InputDecoration(
            labelText: 'Nama Audiens',
            hintText: 'misal: Mahasiswa, Guru, Programmer...',
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          FilledButton(
            onPressed: () {
              if (_newAudienceController.text.trim().isNotEmpty) {
                Navigator.pop(ctx, true);
              }
            },
            child: const Text('Tambah'),
          ),
        ],
      ),
    );

    if (result == true) {
      await _addAudience();
    }
  }

  Future<void> _showEditAudienceDialog(TargetAudience audience) async {
    final controller = TextEditingController(text: audience.name);
    final result = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Edit Audiens'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Nama Audiens'),
          autofocus: true,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          FilledButton(onPressed: () => Navigator.pop(ctx, controller.text.trim()), child: const Text('Simpan')),
        ],
      ),
    );
    if (result != null && result.isNotEmpty && result != audience.name) {
      try {
        final repo = ref.read(appOptionsRepositoryProvider);
        await repo.updateTargetAudience(audience.id, result);
        final refreshed = await repo.getTargetAudiences();
        setState(() => _audiences = refreshed);
        if (mounted) ToastMessage.showSuccess(context, 'Audiens diperbarui.');
      } catch (e) {
        if (mounted) ToastMessage.showError(context, 'Gagal memperbarui: $e');
      }
    }
  }


  // ─── Design Style Actions ─────────────────────────────────────────────────





  Future<void> _showStyleDetailDialog(DesignStyle style) async {
    final theme = Theme.of(context);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(style.name),
        content: SizedBox(
          width: 400,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (style.imageUrl != null && style.imageUrl!.isNotEmpty)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: CachedNetworkImage(
                      imageUrl: style.imageUrl!.startsWith('http')
                          ? style.imageUrl!
                          : '${EnvConfig.baseUrl}${style.imageUrl!.startsWith("/") ? "" : "/"}${style.imageUrl!}',
                      height: 150,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(color: theme.colorScheme.surfaceContainerHighest, child: const Center(child: CircularProgressIndicator())),
                      errorWidget: (context, url, error) => Container(
                        color: theme.colorScheme.surfaceContainerHighest,
                        height: 150,
                        child: const Icon(Icons.broken_image_rounded, size: 40, color: Colors.grey),
                      ),
                    ),
                  ),
                const SizedBox(height: 16),
                Text('Prompt Khusus', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(style.prompt ?? 'Tidak ada prompt khusus.'),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Tutup')),
        ],
      ),
    );
  }

  Future<void> _deleteStyle(String id) async {
    final repo = ref.read(appOptionsRepositoryProvider);
    await repo.deleteDesignStyle(id);
    final refreshed = await repo.getDesignStyles();
    setState(() => _designStyles = refreshed);
    if (mounted) ToastMessage.showSuccess(context, 'Gaya Desain dihapus.');
  }


  @override
  void dispose() {
    _tabController.dispose();
    _newKeyController.dispose();
    _newCategoryController.dispose();
    _newAudienceController.dispose();
    _newStyleController.dispose();
    _newStylePromptController.dispose();
    _newStyleImageUrlController.dispose();

    _nameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final settingsState = ref.watch(settingsProvider);
    final categoryState = ref.watch(categoryProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pengaturan'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.tune_rounded), text: 'Umum'),
            Tab(icon: Icon(Icons.person_rounded), text: 'Profil'),
            Tab(icon: Icon(Icons.vpn_key_rounded), text: 'API Keys'),
            Tab(icon: Icon(Icons.category_rounded), text: 'Kategori'),
            Tab(icon: Icon(Icons.people_rounded), text: 'Audiens'),
            Tab(icon: Icon(Icons.palette_rounded), text: 'Desain'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // ── Tab 1: Umum ────────────────────────────────────────────────────
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Card(
                  color: theme.colorScheme.primaryContainer,
                  margin: EdgeInsets.zero,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.admin_panel_settings, color: theme.colorScheme.onPrimaryContainer),
                            const SizedBox(width: 8),
                            Text('Admin Web Panel', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.onPrimaryContainer)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text('Untuk mengelola data (tambah, edit, hapus) seperti API Key, Kategori, Audiens, Gaya Desain, dan Templates, silakan gunakan website admin panel:', style: TextStyle(color: theme.colorScheme.onPrimaryContainer)),
                        const SizedBox(height: 8),
                        SelectableText('${EnvConfig.baseUrl}/admin', style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: theme.colorScheme.primary,
                              foregroundColor: theme.colorScheme.onPrimary,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            icon: const Icon(Icons.open_in_browser_rounded),
                            label: const Text(
                              'Buka Panel Admin di Aplikasi',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            onPressed: () {
                              final adminUrl = '${EnvConfig.baseUrl}/admin';
                              context.push('/admin-browser?url=${Uri.encodeComponent(adminUrl)}');
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Text('Preferensi Aplikasi',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                Card(
                  margin: EdgeInsets.zero,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Tema Aplikasi', style: TextStyle(fontWeight: FontWeight.w600)),
                        DropdownButton<String>(
                          value: settingsState.settings.theme,
                          items: const [
                            DropdownMenuItem(value: 'SYSTEM', child: Text('Sistem')),
                            DropdownMenuItem(value: 'LIGHT', child: Text('Terang')),
                            DropdownMenuItem(value: 'DARK', child: Text('Gelap')),
                          ],
                          onChanged: (val) {
                            if (val != null) {
                              ref.read(settingsProvider.notifier).updateTheme(val);
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ),

              ],
            ),
          ),
          
          // ── Tab 2: Profil ────────────────────────────────────────────────────
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _profileFormKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Pengaturan Profil',
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  Card(
                    margin: EdgeInsets.zero,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                                  CircleAvatar(
                                    radius: 36,
                                    backgroundColor: theme.colorScheme.primaryContainer,
                                    backgroundImage: ref.watch(authProvider).user?.avatarUrl != null 
                                          ? NetworkImage(ref.watch(authProvider).user!.avatarUrl!) 
                                          : null,
                                    child: ref.watch(authProvider).user?.avatarUrl == null 
                                      ? const Icon(Icons.person, size: 40) : null,
                                  ),
                          const SizedBox(height: 24),
                          TextFormField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              labelText: 'Nama Profil',
                              prefixIcon: Icon(Icons.person_outline),
                            ),
                            validator: (val) => val == null || val.isEmpty ? 'Nama wajib diisi' : null,
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _passwordController,
                            obscureText: true,
                            decoration: const InputDecoration(
                              labelText: 'Sandi Baru (Opsional)',
                              prefixIcon: Icon(Icons.lock_outline),
                              helperText: 'Kosongkan jika tidak ingin mengubah sandi',
                            ),
                          ),
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isUpdatingProfile ? null : _updateProfile,
                              child: _isUpdatingProfile
                                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                                  : const Text('Simpan Perubahan'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: _logout,
                      icon: const Icon(Icons.logout_rounded),
                      label: const Text('Keluar Akun (Logout)'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: theme.colorScheme.error,
                        side: BorderSide(color: theme.colorScheme.error),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Tab 3: API Keys Groq ───────────────────────────────────────────
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Manajemen Groq API Keys',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(
                  'Tambahkan banyak API Key Groq. Jika satu key mencapai limit, sistem otomatis berpindah ke key berikutnya.',
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                ),
                const SizedBox(height: 16),
                const SizedBox(height: 16),
                if (_isLoadingKeys)
                  const Center(child: CircularProgressIndicator())
                else if (_groqKeys.isEmpty)
                  Center(
                    child: Column(
                      children: [
                        Icon(Icons.key_off_rounded, size: 56, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                        const SizedBox(height: 8),
                        const Text('Belum ada API Key. Tambahkan sekarang!'),
                      ],
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _groqKeys.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, idx) {
                      final k = _groqKeys[idx];
                      final key = k['api_key'] as String;
                      final errors = k['error_count'] as int;
                      final isActive = k['is_active'] as bool;
                      final maskedKey = key.length > 16
                          ? '${key.substring(0, 8)}...${key.substring(key.length - 6)}'
                          : key;

                      return Card(
                        margin: EdgeInsets.zero,
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: errors > 5
                                ? theme.colorScheme.errorContainer
                                : theme.colorScheme.primaryContainer,
                            child: Text(
                              '${idx + 1}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: errors > 5
                                    ? theme.colorScheme.onErrorContainer
                                    : theme.colorScheme.onPrimaryContainer,
                              ),
                            ),
                          ),
                          title: Text(maskedKey, style: const TextStyle(fontFamily: 'monospace')),
                          subtitle: Row(
                            children: [
                              Icon(
                                isActive ? Icons.check_circle_rounded : Icons.cancel_rounded,
                                size: 14,
                                color: isActive ? Colors.green : Colors.red,
                              ),
                              const SizedBox(width: 4),
                              Text(isActive ? 'Aktif' : 'Nonaktif'),
                              const SizedBox(width: 12),
                              Icon(Icons.error_outline_rounded, size: 14, color: errors > 0 ? Colors.orange : Colors.grey),
                              const SizedBox(width: 4),
                              Text('$errors error'),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
              ],
            ),
          ),

          // ── Tab 3: Kategori Template ───────────────────────────────────────
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Kategori Template',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(
                  'Kelola kategori yang bisa digunakan saat menyimpan template.',
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                ),
                const SizedBox(height: 16),
                const SizedBox(height: 16),
                if (categoryState.isLoading)
                  const Center(child: CircularProgressIndicator())
                else if (categoryState.categories.isEmpty)
                  Center(
                    child: Column(
                      children: [
                        Icon(Icons.category_outlined, size: 56, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                        const SizedBox(height: 8),
                        const Text('Belum ada kategori.'),
                      ],
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: categoryState.categories.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, idx) {
                      final cat = categoryState.categories[idx];
                      return Card(
                        margin: EdgeInsets.zero,
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: theme.colorScheme.primaryContainer,
                            child: Icon(Icons.folder_rounded, color: theme.colorScheme.onPrimaryContainer),
                          ),
                          title: Text(cat.name),
                          subtitle: Text('${cat.templatesCount} template', style: const TextStyle(fontSize: 12)),
                        ),
                      );
                    },
                  ),
              ],
            ),
          ),

          // ── Tab 4: Target Audiens ─────────────────────────────────────────
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Target Audiens',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Kelola daftar target audiens yang bisa dipilih saat generate prompt.',
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                ),
                const SizedBox(height: 24),
                if (_audiences.isEmpty)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 40),
                      child: Column(
                        children: [
                          Icon(Icons.people_outline_rounded, size: 56, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                          const SizedBox(height: 8),
                          const Text('Belum ada data audiens.'),
                        ],
                      ),
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _audiences.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final a = _audiences[index];
                      return Card(
                        margin: EdgeInsets.zero,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: theme.colorScheme.primaryContainer,
                            child: Icon(Icons.person_outline_rounded, color: theme.colorScheme.primary),
                          ),
                          title: Text(a.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                        ),
                      );
                    },
                  ),
              ],
            ),
          ),

          // ── Tab 5: Gaya Desain ────────────────────────────────────────────
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Gaya Desain',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Kelola daftar gaya desain yang tersedia saat membuat prompt.',
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                ),
                const SizedBox(height: 24),
                if (_designStyles.isEmpty)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 40),
                      child: Column(
                        children: [
                          Icon(Icons.palette_outlined, size: 56, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                          const SizedBox(height: 8),
                          const Text('Belum ada gaya desain.'),
                        ],
                      ),
                    ),
                  )
                else
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 0.85,
                    ),
                    itemCount: _designStyles.length,
                    itemBuilder: (context, index) {
                      final s = _designStyles[index];
                      return Card(
                        margin: EdgeInsets.zero,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        clipBehavior: Clip.antiAlias,
                        child: InkWell(
                          onTap: () => _showStyleDetailDialog(s),
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              // Background Image
                              if (s.imageUrl != null && s.imageUrl!.isNotEmpty)
                                CachedNetworkImage(
                                  imageUrl: s.imageUrl!.startsWith('http')
                                      ? s.imageUrl!
                                      : '${EnvConfig.baseUrl}${s.imageUrl!.startsWith("/") ? "" : "/"}${s.imageUrl!}',
                                  fit: BoxFit.cover,
                                  placeholder: (context, url) => Container(color: theme.colorScheme.surfaceContainerHighest),
                                  errorWidget: (context, url, error) => Container(
                                    color: theme.colorScheme.surfaceContainerHighest,
                                    child: const Icon(Icons.broken_image_rounded, color: Colors.grey),
                                  ),
                                )
                              else
                                Container(
                                  color: theme.colorScheme.surfaceContainerHighest,
                                  child: Icon(Icons.brush_outlined, size: 40, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                                ),
                              // Gradient Overlay
                              Positioned.fill(
                                child: DecoratedBox(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [
                                        Colors.black.withOpacity(0.0),
                                        Colors.black.withOpacity(0.7),
                                      ],
                                      stops: const [0.5, 1.0],
                                    ),
                                  ),
                                ),
                              ),
                              // Title and Actions
                              Positioned(
                                bottom: 8,
                                left: 8,
                                right: 8,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      s.name,
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
