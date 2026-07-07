import 'package:intl/intl.dart';

class Formatters {
  static String formatDateTime(String isoString) {
    try {
      final dateTime = DateTime.parse(isoString).toLocal();
      return DateFormat('dd MMM yyyy, HH:mm').format(dateTime);
    } catch (_) {
      return isoString;
    }
  }

  static String formatDate(String isoString) {
    try {
      final dateTime = DateTime.parse(isoString).toLocal();
      return DateFormat('dd MMMM yyyy').format(dateTime);
    } catch (_) {
      return isoString;
    }
  }
}
