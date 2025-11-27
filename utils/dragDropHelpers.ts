import { Animated, PanResponder } from "react-native";

export interface DragDropState {
  isDragging: boolean;
  draggedWordIndex: number | null;
  dropZoneIndex: number | null;
  draggedWordPosition: Animated.ValueXY;
  wordPositions: { [key: number]: { x: number; y: number } };
}

export interface DragDropHandlers {
  setIsDragging: (isDragging: boolean) => void;
  setDraggedWordIndex: (index: number | null) => void;
  setDropZoneIndex: (index: number | null) => void;
  moveWord: (fromIndex: number, toIndex: number) => void;
}

export const createPanResponder = (
  index: number,
  state: DragDropState,
  handlers: DragDropHandlers
) => {
  return PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },
    onPanResponderGrant: (evt, gestureState) => {
      handlers.setIsDragging(true);
      handlers.setDraggedWordIndex(index);
      state.draggedWordPosition.setOffset({
        x: (state.draggedWordPosition.x as any)._value,
        y: (state.draggedWordPosition.y as any)._value,
      });
      state.draggedWordPosition.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: (evt, gestureState) => {
      state.draggedWordPosition.setValue({
        x: gestureState.dx,
        y: gestureState.dy,
      });

      // Calculate which word position we're hovering over
      const currentX = evt.nativeEvent.pageX;
      const currentY = evt.nativeEvent.pageY;

      // Find the closest word position
      let closestIndex = -1;
      let minDistance = Infinity;

      Object.keys(state.wordPositions).forEach(key => {
        const pos = state.wordPositions[parseInt(key)];
        const distance = Math.sqrt(
          Math.pow(currentX - pos.x, 2) + Math.pow(currentY - pos.y, 2)
        );
        if (distance < minDistance && parseInt(key) !== index) {
          minDistance = distance;
          closestIndex = parseInt(key);
        }
      });

      if (minDistance < 50) {
        // Within 50 pixels
        handlers.setDropZoneIndex(closestIndex);
      } else {
        handlers.setDropZoneIndex(null);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      handlers.setIsDragging(false);
      handlers.setDraggedWordIndex(null);

      if (state.dropZoneIndex !== null && state.dropZoneIndex !== index) {
        handlers.moveWord(index, state.dropZoneIndex);
      }

      handlers.setDropZoneIndex(null);
      state.draggedWordPosition.flattenOffset();

      // Reset position with animation
      Animated.spring(state.draggedWordPosition, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });
};
