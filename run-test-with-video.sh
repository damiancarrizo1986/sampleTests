#!/bin/bash
set -e

DISPLAY_NUM=99
SCREEN_RES=1280x720x24
VIDEO_DIR="./recordings"
VIDEO_FILE="$VIDEO_DIR/login-test.mp4"

mkdir -p "$VIDEO_DIR"

echo "Starting Xvfb on display :$DISPLAY_NUM..."
Xvfb :$DISPLAY_NUM -screen 0 $SCREEN_RES &
XVFB_PID=$!
sleep 1

export DISPLAY=:$DISPLAY_NUM

echo "Starting screen recording..."
ffmpeg -y -f x11grab -video_size 1280x720 -framerate 15 -i :$DISPLAY_NUM \
  -c:v libx264 -preset ultrafast -pix_fmt yuv420p \
  "$VIDEO_FILE" &
FFMPEG_PID=$!
sleep 1

echo "Running WDIO test..."
npx wdio run wdio.conf.js 2>&1 | tail -25
TEST_EXIT=$?

sleep 2

echo "Stopping recording..."
kill -INT $FFMPEG_PID 2>/dev/null || true
wait $FFMPEG_PID 2>/dev/null || true

echo "Stopping Xvfb..."
kill $XVFB_PID 2>/dev/null || true
wait $XVFB_PID 2>/dev/null || true

echo ""
echo "Video saved to: $VIDEO_FILE"
ls -lh "$VIDEO_FILE"

exit $TEST_EXIT
