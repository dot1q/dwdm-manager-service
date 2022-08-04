// meh, just export the whole dang thing as an object...

export default {
  config: {
    src: {
      files: [
        'src/**/*'
      ],
      babel: [
        'src/**/*.js',
        '!src/**/{fixtures,templates}/**',
        '!src/**/*.spec.js',
      ]
    },
    dist: "dist",
    clean: [
      'dist/',
      'dist/docs/',
      'dist/includes/',
      'dist/public_html/',
      'dist/scripts/',
      'dist/operations.php',
      'dist/coverage/',
      // Delete all files and folders that contain static data
      '!dist/config/**/*',
      '!dist/config.php',
      '!dist/pm2.json',
      '!dist/fms_files/',
      '!dist/fms_files/**/*'
    ],
    destDir: "dist",
    test: [
      'src/**/*.spec.js'
    ]
  }
};
