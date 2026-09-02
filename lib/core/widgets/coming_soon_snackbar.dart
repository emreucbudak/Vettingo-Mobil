import 'package:flutter/material.dart';

void showComingSoonSnackbar(BuildContext context, String label) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text('$label is coming soon.')));
}
