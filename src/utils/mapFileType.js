export function mapFileTypeToScene(file) {
  if (!file || !file.name) {
    return {
      scene: 'BlackHole',
      machineName: 'Black Hole',
      icon: '📁',
      category: 'Unknown File'
    };
  }

  const nameParts = file.name.split('.');
  const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase() : '';

  // 1. PDF
  if (ext === 'pdf') {
    return {
      scene: 'HydraulicPress',
      machineName: 'Hydraulic Press',
      icon: '📕',
      category: 'PDF Document'
    };
  }

  // 2. Word
  if (['doc', 'docx', 'rtf', 'odt'].includes(ext)) {
    return {
      scene: 'ElephantStomp',
      machineName: 'Elephant Stomp',
      icon: '📝',
      category: 'Word Document'
    };
  }

  // 3. Excel
  if (['xls', 'xlsx', 'csv', 'tsv'].includes(ext)) {
    return {
      scene: 'WreckingBall',
      machineName: 'Wrecking Ball',
      icon: '📊',
      category: 'Excel Spreadsheet'
    };
  }

  // 4. PPT
  if (['ppt', 'pptx', 'key', 'odp'].includes(ext)) {
    return {
      scene: 'RocketLaunch',
      machineName: 'Rocket Launch',
      icon: '📽️',
      category: 'PowerPoint Presentation'
    };
  }

  // 5. Images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'].includes(ext)) {
    return {
      scene: 'Juicer',
      machineName: 'Pixel Juicer',
      icon: '🖼️',
      category: 'Image File'
    };
  }

  // 6. Video
  if (['mp4', 'mov', 'mkv', 'webm', 'avi', 'flv', 'wmv'].includes(ext)) {
    return {
      scene: 'TrashCompactor',
      machineName: 'Trash Compactor',
      icon: '🎬',
      category: 'Video File'
    };
  }

  // 7. Audio
  if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(ext)) {
    return {
      scene: 'Steamroller',
      machineName: 'Steamroller',
      icon: '🎵',
      category: 'Audio File'
    };
  }

  // 8. Code files
  if ([
    'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'rs',
    'go', 'php', 'rb', 'html', 'css', 'json', 'xml', 'sh', 'bat', 'sql'
  ].includes(ext)) {
    return {
      scene: 'BugZapper',
      machineName: 'Bug Zapper',
      icon: '💻',
      category: 'Code File'
    };
  }

  // 9. Text files
  if (['txt', 'md', 'log', 'ini', 'cfg', 'conf'].includes(ext)) {
    return {
      scene: 'Shredder',
      machineName: 'Paper Shredder',
      icon: '📄',
      category: 'Text File'
    };
  }

  // 10. Zip/rar
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return {
      scene: 'Matryoshka',
      machineName: 'Matryoshka Smash',
      icon: '📦',
      category: 'Archive File'
    };
  }

  // 11. Anything else
  return {
    scene: 'BlackHole',
    machineName: 'Black Hole',
    icon: '📁',
    category: 'Generic File'
  };
}
