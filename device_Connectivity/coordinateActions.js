module.exports = async function tapExample(driver) {
  console.log('🚀 Tapping on coordinate (500, 1200)...');

  await driver.touchAction({
    action: 'tap',
    x: 500,
    y: 1200
  });

  console.log('✅ Tap complete!');
};
