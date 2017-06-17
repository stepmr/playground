var dircompare = require('dir-compare'),
    path = require('path');

function _isImg (testStr){
  return (testStr.match(/\.(jpeg|jpg|gif|png)$/) !== null);
}

function _addImgSuffix (filename, suffix){
  return filename.replace(/(\.(jpeg|jpg|gif|png))$/, '-' + suffix + '$1');
}

function _isMissingInSrc (diffSetObj){
  return (diffSetObj.state === 'right' && diffSetObj.type1 === 'missing');
}

function getStaleFileList (srcImgPath, destImgPath, responsiveSuffixList){
  // Compare files names only (ignore size, date and content, ignore
  var comparison = dircompare.compareSync(
    path.join(__dirname, srcImgPath),
    path.join(__dirname, destImgPath),
    {
      compareSize: false,
      compareDate: false,
      compareContent: false,
      excludeFilter: '**/*\-+(mobile|tablet).+(jpg|jpeg|gif|png)'
    }
  );
  
  return comparison.diffSet
    // filter out fresh files
    .filter(function(obj) {
      if (_isMissingInSrc(obj)) { 
        return obj;
      }
    })
    // build list of stale file paths and their responsive variants (which are not present in the source directory)
    .map(function(obj) {
      var targets = [],
          target = path.relative(__dirname, path.join(obj.path2, obj.name2));
      
      // Add initial target (can be dir or file)
      targets.push(target);
      
      // If target is an image add variants with responsive suffixes
      if (_isImg(obj.name2)) {
        responsiveSuffixList.forEach(function(suffix){
          targets.push(_addImgSuffix(target, suffix));
        });
      }

      return targets;
    });
}

exports.getStaleFileList = getStaleFileList;

