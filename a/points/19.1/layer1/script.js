(function(){
  var annexData = {"LinearSearchPseudo": {"kind": "pseudo", "lines": [{"visible": "", "tip": "// Linear search in a 1D array myList between lowerBound and upperBound (inclusive)\n// Checks each element in order until the item is found or the upper bound is reached"}, {"visible": "found ← FALSE", "tip": ""}, {"visible": "index ← lowerBound", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "WHILE (index ≤ upperBound) AND (found = FALSE) DO", "tip": ""}, {"visible": "    IF myList[index] = item THEN", "tip": ""}, {"visible": "        found ← TRUE", "tip": ""}, {"visible": "    ELSE", "tip": ""}, {"visible": "        index ← index + 1", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "ENDWHILE", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "IF found = TRUE THEN", "tip": ""}, {"visible": "    OUTPUT index", "tip": ""}, {"visible": "ELSE", "tip": ""}, {"visible": "    OUTPUT \"Not found\"", "tip": ""}, {"visible": "ENDIF", "tip": ""}]}, "LinearSearchPython": {"kind": "python", "lines": [{"visible": "def linear_search(my_list, item, lower_bound=0, upper_bound=None):", "tip": "    \"\"\"\n    Linear search: checks each element in order from lower_bound to upper_bound (inclusive)\n    until the item is found or the upper bound is reached.\n\n    Returns:\n        int: index of item if found, otherwise -1.\n    \"\"\""}, {"visible": "    if upper_bound is None:", "tip": ""}, {"visible": "        upper_bound = len(my_list) - 1", "tip": ""}, {"visible": "    index = lower_bound", "tip": ""}, {"visible": "    while index <= upper_bound:", "tip": ""}, {"visible": "        if my_list[index] == item:", "tip": ""}, {"visible": "            return index", "tip": ""}, {"visible": "        index += 1", "tip": ""}, {"visible": "    return -1", "tip": ""}]}, "BinarySearchPseudo": {"kind": "pseudo", "lines": [{"visible": "", "tip": "// Binary search in a sorted (ascending) 1D array List\n// Repeatedly checks the middle element and discards the half that cannot contain SearchItem"}, {"visible": "Found ← FALSE", "tip": ""}, {"visible": "SearchFailed ← FALSE", "tip": ""}, {"visible": "First ← 0", "tip": ""}, {"visible": "Last ← MaxItems - 1", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "WHILE NOT Found AND NOT SearchFailed DO", "tip": ""}, {"visible": "    Middle ← (First + Last) DIV 2", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    IF List[Middle] = SearchItem THEN", "tip": ""}, {"visible": "        Found ← TRUE", "tip": ""}, {"visible": "    ELSE", "tip": ""}, {"visible": "        IF First >= Last THEN", "tip": ""}, {"visible": "            SearchFailed ← TRUE", "tip": ""}, {"visible": "        ELSE", "tip": ""}, {"visible": "            IF List[Middle] > SearchItem THEN", "tip": ""}, {"visible": "                Last ← Middle - 1", "tip": ""}, {"visible": "            ELSE", "tip": ""}, {"visible": "                First ← Middle + 1", "tip": ""}, {"visible": "            ENDIF", "tip": ""}, {"visible": "        ENDIF", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "ENDWHILE", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "IF Found = TRUE THEN", "tip": ""}, {"visible": "    OUTPUT Middle", "tip": ""}, {"visible": "ELSE", "tip": ""}, {"visible": "    OUTPUT \"Item not present in array\"", "tip": ""}, {"visible": "ENDIF", "tip": ""}]}, "BinarySearchPython": {"kind": "python", "lines": [{"visible": "def binary_search(sorted_list, search_item):", "tip": "    \"\"\"\n    Binary search on a list sorted in ascending order.\n\n    Preconditions:\n        sorted_list is sorted in ascending order.\n\n    Returns:\n        int: index of search_item if found, otherwise -1.\n    \"\"\""}, {"visible": "    first = 0", "tip": ""}, {"visible": "    last = len(sorted_list) - 1", "tip": ""}, {"visible": "    while first <= last:", "tip": ""}, {"visible": "        middle = (first + last) // 2", "tip": ""}, {"visible": "        if sorted_list[middle] == search_item:", "tip": ""}, {"visible": "            return middle", "tip": ""}, {"visible": "        elif sorted_list[middle] > search_item:", "tip": ""}, {"visible": "            last = middle - 1", "tip": ""}, {"visible": "        else:", "tip": ""}, {"visible": "            first = middle + 1", "tip": ""}, {"visible": "    return -1", "tip": ""}]}, "InsertionSortPseudo": {"kind": "pseudo", "lines": [{"visible": "", "tip": "// Insertion sort\n// Values to be sorted are stored in a 1D array, List"}, {"visible": "FOR Pointer ← 1 TO NumberOfItems - 1", "tip": ""}, {"visible": "    ItemToBeInserted ← List[Pointer]", "tip": ""}, {"visible": "    CurrentItem ← Pointer - 1   // last item in the sorted part", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    WHILE (List[CurrentItem] > ItemToBeInserted) AND (CurrentItem > -1) DO", "tip": "// Move larger items one place to the right until the correct position is reached"}, {"visible": "        List[CurrentItem + 1] ← List[CurrentItem]  // move item down", "tip": ""}, {"visible": "        CurrentItem ← CurrentItem - 1              // look at the item above", "tip": ""}, {"visible": "    ENDWHILE", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    List[CurrentItem + 1] ← ItemToBeInserted", "tip": "// Insert the item into the gap created"}, {"visible": "NEXT Pointer", "tip": ""}]}, "InsertionSortPython": {"kind": "python", "lines": [{"visible": "def insertion_sort(a):", "tip": "    \"\"\"\n    Insertion sort (ascending).\n\n    How it works:\n    - Treat the left part of the list as sorted.\n    - Take the next item (key).\n    - Shift larger items one position to the right.\n    - Insert key into the gap created.\n\n    Returns:\n        list: the same list object, sorted in ascending order.\n    \"\"\""}, {"visible": "    n = len(a)", "tip": ""}, {"visible": "    for pointer in range(1, n):", "tip": "# Start from index 1 because a[0] alone is already a sorted part"}, {"visible": "        key = a[pointer]", "tip": "# the item to insert"}, {"visible": "        current = pointer - 1", "tip": "# last index in the sorted part"}, {"visible": "        while current >= 0 and a[current] > key:", "tip": "# Shift larger items to the right"}, {"visible": "            a[current + 1] = a[current]", "tip": ""}, {"visible": "            current -= 1", "tip": ""}, {"visible": "        a[current + 1] = key", "tip": "# Insert key into its correct position"}, {"visible": "    return a", "tip": ""}]}, "BubbleSortPseudo": {"kind": "pseudo", "lines": [{"visible": "", "tip": "// Bubble sort (nested loop structure)\n// Values are stored in a 1D array MyList of size n"}, {"visible": "Unsorted ← n - 1", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "FOR i ← 0 TO n - 2", "tip": ""}, {"visible": "    FOR j ← 0 TO Unsorted - 1", "tip": ""}, {"visible": "        IF MyList[j] > MyList[j + 1] THEN", "tip": ""}, {"visible": "            Temp ← MyList[j]", "tip": ""}, {"visible": "            MyList[j] ← MyList[j + 1]", "tip": ""}, {"visible": "            MyList[j + 1] ← Temp", "tip": ""}, {"visible": "        ENDIF", "tip": ""}, {"visible": "    NEXT j", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    Unsorted ← Unsorted - 1", "tip": "// After each pass, the largest remaining item is at the end"}, {"visible": "NEXT i", "tip": ""}]}, "BubbleSortPython": {"kind": "python", "lines": [{"visible": "def bubble_sort(a):", "tip": "    \"\"\"\n    Bubble sort (ascending).\n\n    How it works:\n    - Compare neighbouring items.\n    - Swap them if they are in the wrong order.\n    - After each full pass, the largest remaining item ends up at the end,\n      so the unsorted part can shrink.\n\n    Returns:\n        list: the same list object, sorted in ascending order.\n    \"\"\""}, {"visible": "    n = len(a)", "tip": ""}, {"visible": "    unsorted = n - 1", "tip": ""}, {"visible": "    for _ in range(n - 1):", "tip": "# Repeat passes through the list"}, {"visible": "        for j in range(unsorted):", "tip": "# Compare only within the unsorted part"}, {"visible": "            if a[j] > a[j + 1]:", "tip": ""}, {"visible": "                temp = a[j]", "tip": ""}, {"visible": "                a[j] = a[j + 1]", "tip": ""}, {"visible": "                a[j + 1] = temp", "tip": ""}, {"visible": "        unsorted -= 1", "tip": "# One more item is in the correct final position"}, {"visible": "    return a", "tip": ""}]}, "linkedInitialisePseudo": {"kind": "pseudo", "lines": [{"visible": "PROCEDURE linkedInitialisePseudo(Size)", "tip": ""}, {"visible": "    NullPointer <- -1", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    StartPointer <- NullPointer", "tip": ""}, {"visible": "    FreeListPtr <- 0", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    FOR i <- 0 TO Size - 2", "tip": ""}, {"visible": "        List[i].Pointer <- i + 1", "tip": ""}, {"visible": "        List[i].Data <- Null   // optional placeholder", "tip": ""}, {"visible": "    NEXT i", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    List[Size - 1].Pointer <- NullPointer", "tip": ""}, {"visible": "    List[Size - 1].Data <- Null  // optional placeholder", "tip": ""}, {"visible": "ENDPROCEDURE", "tip": ""}]}, "linkedInitialisePython": {"kind": "python", "lines": [{"visible": "NULL_POINTER = -1", "tip": "Null pointer value used in this linked list"}, {"visible": "LinkedList = []", "tip": "LinkedList will store nodes as: [data, nextPointer]\nExample: LinkedList[3] = [56, -1] means:\ndata = 56\nnextPointer = -1 (end of list)"}, {"visible": "FirstNode = NULL_POINTER", "tip": "FirstNode is the start pointer (index of first node in the list)"}, {"visible": "FirstEmpty = NULL_POINTER", "tip": "FirstEmpty is the free list pointer (index of first free node)"}, {"visible": "def linkedInitialisePython(size):", "tip": "    \"\"\"\n    Create an empty linked list of a fixed size.\n    Also create a free list that chains all nodes together.\n\n    Returns nothing because it sets the global variables:\n      LinkedList, FirstNode, FirstEmpty\n    \"\"\""}, {"visible": "    global LinkedList", "tip": ""}, {"visible": "    global FirstNode", "tip": ""}, {"visible": "    global FirstEmpty", "tip": ""}, {"visible": "    FirstNode = NULL_POINTER", "tip": "# The linked list is empty at the start, so there is no first node"}, {"visible": "    FirstEmpty = 0", "tip": "# The first free node will be index 0 (the start of the free list)"}, {"visible": "    LinkedList = []", "tip": "# Create the array of nodes, each node initially stores:\n#   data = -1 (meaning \"no real data stored yet\")\n#   nextPointer = index of next free node (set below)"}, {"visible": "    for i in range(size):", "tip": ""}, {"visible": "        LinkedList.append([-1, NULL_POINTER])", "tip": "# Temporarily set nextPointer to -1, we will fix pointers after"}, {"visible": "    for i in range(size - 1):", "tip": "# Link all nodes into the free list:\n# node 0 points to node 1, node 1 points to node 2, ..., last points to -1"}, {"visible": "        LinkedList[i][1] = i + 1", "tip": "# next free node index"}, {"visible": "    LinkedList[size - 1][1] = NULL_POINTER", "tip": "# The last node in the free list points to -1 to show end of free list"}]}, "linkedFindPseudo": {"kind": "pseudo", "lines": [{"visible": "FUNCTION linkedFindPseudo(SearchItem) RETURNS INTEGER", "tip": ""}, {"visible": "    CurrentPtr <- StartPointer", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    WHILE CurrentPtr <> NullPointer AND List[CurrentPtr].Data <> SearchItem DO", "tip": ""}, {"visible": "        CurrentPtr <- List[CurrentPtr].Pointer", "tip": ""}, {"visible": "    ENDWHILE", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    RETURN CurrentPtr   // returns -1 if not found", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "linkedFindPython": {"kind": "python", "lines": [{"visible": "def linkedFindPython(search_item):", "tip": "    \"\"\"\n    Find the first node containing search_item.\n\n    Returns:\n      index of the node if found\n      -1 if not found\n    \"\"\""}, {"visible": "    global LinkedList", "tip": ""}, {"visible": "    global FirstNode", "tip": ""}, {"visible": "    current_ptr = FirstNode", "tip": "# Start from the first node in the linked list"}, {"visible": "    while current_ptr != NULL_POINTER and LinkedList[current_ptr][0] != search_item:", "tip": "# Keep going until we either reach the end (-1) or find the item"}, {"visible": "        current_ptr = LinkedList[current_ptr][1]", "tip": "# Move to the next node by following the stored pointer"}, {"visible": "    return current_ptr", "tip": "# If found, current_ptr is the node index; if not, it is -1"}]}, "linkedInsertPseudo": {"kind": "pseudo", "lines": [{"visible": "Insertion rule used here: insert at the front.", "tip": ""}, {"visible": "FUNCTION linkedInsertPseudo(NewItem) RETURNS BOOLEAN", "tip": ""}, {"visible": "    IF FreeListPtr = NullPointer THEN", "tip": ""}, {"visible": "        RETURN FALSE", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    NewNodePtr <- FreeListPtr", "tip": ""}, {"visible": "    FreeListPtr <- List[FreeListPtr].Pointer", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    List[NewNodePtr].Data <- NewItem", "tip": ""}, {"visible": "    List[NewNodePtr].Pointer <- StartPointer", "tip": ""}, {"visible": "    StartPointer <- NewNodePtr", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    RETURN TRUE", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "linkedInsertPython": {"kind": "python", "lines": [{"visible": "def linkedInsertPython(new_item):", "tip": "    \"\"\"\n    Insert new_item at the front of the linked list.\n\n    Returns:\n      True  if insertion succeeded\n      False if there is no free node (list is full)\n    \"\"\""}, {"visible": "    global LinkedList", "tip": ""}, {"visible": "    global FirstNode", "tip": ""}, {"visible": "    global FirstEmpty", "tip": ""}, {"visible": "    if FirstEmpty == NULL_POINTER:", "tip": "# If FirstEmpty is -1, the free list is empty, so there is no space"}, {"visible": "        return False", "tip": ""}, {"visible": "    new_ptr = FirstEmpty", "tip": "# Take the first free node from the free list"}, {"visible": "    next_free = LinkedList[new_ptr][1]", "tip": "# Save the next free node index BEFORE we reuse this node"}, {"visible": "    FirstEmpty = next_free", "tip": "# Move the free list head forward"}, {"visible": "    LinkedList[new_ptr][0] = new_item", "tip": "# Store the new data in the node we just took"}, {"visible": "    LinkedList[new_ptr][1] = FirstNode", "tip": "# Make the new node point to the current first node of the list"}, {"visible": "    FirstNode = new_ptr", "tip": "# Update FirstNode so the linked list now starts at the new node"}, {"visible": "    return True", "tip": ""}]}, "linkedDeletePseudo": {"kind": "pseudo", "lines": [{"visible": "FUNCTION linkedDeletePseudo(DeleteItem) RETURNS BOOLEAN", "tip": ""}, {"visible": "    ThisPtr <- StartPointer", "tip": ""}, {"visible": "    PrevPtr <- NullPointer", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    WHILE ThisPtr <> NullPointer AND List[ThisPtr].Data <> DeleteItem DO", "tip": ""}, {"visible": "        PrevPtr <- ThisPtr", "tip": ""}, {"visible": "        ThisPtr <- List[ThisPtr].Pointer", "tip": ""}, {"visible": "    ENDWHILE", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    IF ThisPtr = NullPointer THEN", "tip": ""}, {"visible": "        RETURN FALSE", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    IF ThisPtr = StartPointer THEN", "tip": ""}, {"visible": "        StartPointer <- List[StartPointer].Pointer", "tip": ""}, {"visible": "    ELSE", "tip": ""}, {"visible": "        List[PrevPtr].Pointer <- List[ThisPtr].Pointer", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    List[ThisPtr].Pointer <- FreeListPtr", "tip": ""}, {"visible": "    FreeListPtr <- ThisPtr", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    RETURN TRUE", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "linkedDeletePython": {"kind": "python", "lines": [{"visible": "def linkedDeletePython(item_to_delete):", "tip": "    \"\"\"\n    Delete the first node containing item_to_delete.\n\n    Returns:\n      True  if deletion succeeded\n      False if the item was not found\n    \"\"\""}, {"visible": "    global LinkedList", "tip": ""}, {"visible": "    global FirstNode", "tip": ""}, {"visible": "    global FirstEmpty", "tip": ""}, {"visible": "    this_ptr = FirstNode", "tip": "# Start searching from the first node in the linked list"}, {"visible": "    prev_ptr = NULL_POINTER", "tip": "# prev_ptr tracks the node before this_ptr"}, {"visible": "    while this_ptr != NULL_POINTER and LinkedList[this_ptr][0] != item_to_delete:", "tip": "# Move through the list until we find the item or reach the end"}, {"visible": "        prev_ptr = this_ptr", "tip": "# The current node becomes the previous node"}, {"visible": "        this_ptr = LinkedList[this_ptr][1]", "tip": "# Follow the pointer to move to the next node"}, {"visible": "    if this_ptr == NULL_POINTER:", "tip": "# If this_ptr is -1, we reached the end without finding the item"}, {"visible": "        return False", "tip": ""}, {"visible": "    if this_ptr == FirstNode:", "tip": "# Remove the node from the linked list"}, {"visible": "        FirstNode = LinkedList[FirstNode][1]", "tip": "# Deleting the first node:\n# FirstNode must move to the second node"}, {"visible": "    else:", "tip": ""}, {"visible": "        LinkedList[prev_ptr][1] = LinkedList[this_ptr][1]", "tip": "# Deleting a middle or last node:\n# Make the previous node skip over the deleted node"}, {"visible": "    LinkedList[this_ptr][1] = FirstEmpty", "tip": "# Return the deleted node to the free list\n# Step 1: make the deleted node point to the current first free node"}, {"visible": "    FirstEmpty = this_ptr", "tip": "# Step 2: update the free list head so it becomes the deleted node\n# This means the deleted node is now the first free node available for reuse"}, {"visible": "    LinkedList[this_ptr][0] = -1", "tip": "# Optional: clear the data to show this node is now empty"}, {"visible": "    return True", "tip": ""}]}, "stackInitialisePseudo": {"kind": "pseudo", "lines": [{"visible": "CONSTANT EMPTYSTRING = \"\"", "tip": ""}, {"visible": "CONSTANT NullPointer = -1", "tip": ""}, {"visible": "CONSTANT MaxStackSize = 8", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "DECLARE BaseOfStackPointer : INTEGER", "tip": ""}, {"visible": "DECLARE TopOfStackPointer  : INTEGER", "tip": ""}, {"visible": "DECLARE Stack : ARRAY[0 : MaxStackSize - 1] OF STRING", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "PROCEDURE stackInitialisePseudo", "tip": ""}, {"visible": "    BaseOfStackPointer <- 0", "tip": ""}, {"visible": "    TopOfStackPointer  <- NullPointer", "tip": ""}, {"visible": "ENDPROCEDURE", "tip": ""}]}, "stackIsEmptyPseudo": {"kind": "pseudo", "lines": [{"visible": "FUNCTION stackIsEmptyPseudo RETURNS BOOLEAN", "tip": ""}, {"visible": "    IF TopOfStackPointer = NullPointer THEN", "tip": ""}, {"visible": "        RETURN TRUE", "tip": ""}, {"visible": "    ELSE", "tip": ""}, {"visible": "        RETURN FALSE", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "stackIsFullPseudo": {"kind": "pseudo", "lines": [{"visible": "FUNCTION stackIsFullPseudo RETURNS BOOLEAN", "tip": ""}, {"visible": "    IF TopOfStackPointer >= MaxStackSize - 1 THEN", "tip": ""}, {"visible": "        RETURN TRUE", "tip": ""}, {"visible": "    ELSE", "tip": ""}, {"visible": "        RETURN FALSE", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "stackPushPseudo": {"kind": "pseudo", "lines": [{"visible": "PROCEDURE stackPushPseudo(NewItem)", "tip": ""}, {"visible": "    IF TopOfStackPointer < MaxStackSize - 1 THEN", "tip": ""}, {"visible": "        TopOfStackPointer <- TopOfStackPointer + 1", "tip": ""}, {"visible": "        Stack[TopOfStackPointer] <- NewItem", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "ENDPROCEDURE", "tip": ""}]}, "stackPopPseudo": {"kind": "pseudo", "lines": [{"visible": "FUNCTION stackPopPseudo RETURNS STRING", "tip": ""}, {"visible": "    DECLARE Item : STRING", "tip": ""}, {"visible": "    Item <- EMPTYSTRING", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    IF TopOfStackPointer > NullPointer THEN", "tip": ""}, {"visible": "        Item <- Stack[TopOfStackPointer]", "tip": ""}, {"visible": "        TopOfStackPointer <- TopOfStackPointer - 1", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    RETURN Item", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "stackInitialisePython": {"kind": "python", "lines": [{"visible": "MAX_STACK_SIZE = 8", "tip": ""}, {"visible": "EMPTY_STRING = \"\"", "tip": ""}, {"visible": "Stack = [EMPTY_STRING] * (MAX_STACK_SIZE + 1)", "tip": ""}, {"visible": "BasePointer = 1", "tip": ""}, {"visible": "TopPointer = 0", "tip": ""}, {"visible": "def stackInitialisePython():", "tip": "    \"\"\"\n    Set the stack to an empty state.\n    \"\"\""}, {"visible": "    global Stack", "tip": ""}, {"visible": "    global BasePointer", "tip": ""}, {"visible": "    global TopPointer", "tip": ""}, {"visible": "    BasePointer = 1", "tip": ""}, {"visible": "    TopPointer = 0", "tip": ""}, {"visible": "    for i in range(1, MAX_STACK_SIZE + 1):", "tip": ""}, {"visible": "        Stack[i] = EMPTY_STRING", "tip": ""}]}, "stackIsEmptyPython": {"kind": "python", "lines": [{"visible": "def stackIsEmptyPython():", "tip": "    \"\"\"\n    Return True if the stack is empty, otherwise False.\n    \"\"\""}, {"visible": "    global BasePointer", "tip": ""}, {"visible": "    global TopPointer", "tip": ""}, {"visible": "    return TopPointer < BasePointer", "tip": ""}]}, "stackIsFullPython": {"kind": "python", "lines": [{"visible": "def stackIsFullPython():", "tip": "    \"\"\"\n    Return True if the stack is full, otherwise False.\n    \"\"\""}, {"visible": "    global TopPointer", "tip": ""}, {"visible": "    return TopPointer == MAX_STACK_SIZE", "tip": ""}]}, "stackPushPython": {"kind": "python", "lines": [{"visible": "def stackPushPython(new_item):", "tip": "    \"\"\"\n    Add new_item to the top of the stack.\n    Return True if the push succeeds, otherwise False.\n    \"\"\""}, {"visible": "    global Stack", "tip": ""}, {"visible": "    global TopPointer", "tip": ""}, {"visible": "    if stackIsFullPython():", "tip": ""}, {"visible": "        return False", "tip": ""}, {"visible": "    TopPointer = TopPointer + 1", "tip": ""}, {"visible": "    Stack[TopPointer] = new_item", "tip": ""}, {"visible": "    return True", "tip": ""}]}, "stackPopPython": {"kind": "python", "lines": [{"visible": "def stackPopPython():", "tip": "    \"\"\"\n    Remove and return the top item from the stack.\n    Return EMPTY_STRING if the stack is empty.\n    \"\"\""}, {"visible": "    global Stack", "tip": ""}, {"visible": "    global TopPointer", "tip": ""}, {"visible": "    if stackIsEmptyPython():", "tip": ""}, {"visible": "        return EMPTY_STRING", "tip": ""}, {"visible": "    item = Stack[TopPointer]", "tip": ""}, {"visible": "    Stack[TopPointer] = EMPTY_STRING", "tip": ""}, {"visible": "    TopPointer = TopPointer - 1", "tip": ""}, {"visible": "    return item", "tip": ""}]}, "queueInitialisePseudo": {"kind": "pseudo", "lines": [{"visible": "CONSTANT EMPTYSTRING = \"\"", "tip": "// NullPointer should be set to -1 if using array element with index 0"}, {"visible": "CONSTANT NullPointer = -1", "tip": ""}, {"visible": "CONSTANT MaxQueueSize = 8", "tip": ""}, {"visible": "DECLARE FrontOfQueuePointer : INTEGER", "tip": ""}, {"visible": "DECLARE EndOfQueuePointer : INTEGER", "tip": ""}, {"visible": "DECLARE NumberInQueue : INTEGER", "tip": ""}, {"visible": "DECLARE Queue : ARRAY[0 : MaxQueueSize – 1] OF STRING", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "PROCEDURE InitialiseQueue", "tip": ""}, {"visible": "  FrontOfQueuePointer ← NullPointer // set front of queue pointer", "tip": ""}, {"visible": "  EndOfQueuePointer ← NullPointer   // set end of queue pointer", "tip": ""}, {"visible": "  NumberInQueue ← 0                // no elements in queue", "tip": ""}, {"visible": "ENDPROCEDURE", "tip": ""}]}, "queueInitialisePython": {"kind": "python", "lines": [{"visible": "MAX_QUEUE_SIZE = 20", "tip": "Fixed-size circular queue using an array and three control variables.\n# Maximum number of items the queue can store"}, {"visible": "Queue = [0] * MAX_QUEUE_SIZE", "tip": "# The array that stores the queue items"}, {"visible": "HeadPointer = -1", "tip": "# Index of the front item; -1 means the queue is empty"}, {"visible": "TailPointer = -1", "tip": "# Index of the last item added; -1 means the queue is empty"}, {"visible": "NumberItems = 0", "tip": "# How many items are currently in the queue"}]}, "queueEnqueuePseudo": {"kind": "pseudo", "lines": [{"visible": "PROCEDURE AddToQueue(NewItem)", "tip": ""}, {"visible": "  IF NumberInQueue < MaxQueueSize", "tip": ""}, {"visible": "  THEN // there is space in the queue", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    EndOfQueuePointer ← EndOfQueuePointer + 1", "tip": "// increment end of queue pointer"}, {"visible": "", "tip": ""}, {"visible": "    IF EndOfQueuePointer > MaxQueueSize – 1", "tip": "// check for wrap-round"}, {"visible": "    THEN // wrap to beginning of array", "tip": ""}, {"visible": "      EndOfQueuePointer ← 0", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    Queue[EndOfQueuePointer] ← NewItem", "tip": "// add item to end of queue"}, {"visible": "", "tip": ""}, {"visible": "    NumberInQueue ← NumberInQueue + 1", "tip": "// increment counter"}, {"visible": "", "tip": ""}, {"visible": "  ENDIF", "tip": ""}, {"visible": "ENDPROCEDURE", "tip": ""}]}, "queueEnqueuePython": {"kind": "python", "lines": [{"visible": "def queueEnqueuePython(input_data):", "tip": "    \"\"\"\n    Adds one item to the rear of the circular queue.\n\n    Returns:\n        True  if the item was added\n        False if the queue is full\n    \"\"\""}, {"visible": "    global Queue, HeadPointer, TailPointer, NumberItems", "tip": ""}, {"visible": "    if NumberItems >= MAX_QUEUE_SIZE:", "tip": "# 1) Check for overflow (queue full)"}, {"visible": "        return False", "tip": ""}, {"visible": "    if TailPointer == -1:", "tip": "# 2) If the queue is empty, the first item sets both head and tail"}, {"visible": "        TailPointer = 0", "tip": "# Tail now points to index 0"}, {"visible": "        HeadPointer = 0", "tip": "# Head also points to index 0"}, {"visible": "        Queue[TailPointer] = input_data", "tip": "# Store the first item"}, {"visible": "    else:", "tip": ""}, {"visible": "        if TailPointer >= MAX_QUEUE_SIZE - 1:", "tip": "# 3) Move TailPointer forward (wrap-round if at the end)"}, {"visible": "            TailPointer = 0", "tip": "# Wrap to the start of the array"}, {"visible": "        else:", "tip": ""}, {"visible": "            TailPointer += 1", "tip": "# Move to the next index"}, {"visible": "        Queue[TailPointer] = input_data", "tip": "# 4) Store the new item at the new tail position"}, {"visible": "    NumberItems += 1", "tip": "# 5) Increase the item count because one item was added"}, {"visible": "    return True", "tip": ""}]}, "queueDequeuePseudo": {"kind": "pseudo", "lines": [{"visible": "FUNCTION RemoveFromQueue()", "tip": ""}, {"visible": "  DECLARE Item : STRING", "tip": ""}, {"visible": "  Item ← EMPTYSTRING", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "  IF NumberInQueue > 0", "tip": ""}, {"visible": "  THEN // there is at least one item in the queue", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    Item ← Queue[FrontOfQueuePointer]", "tip": "// remove item from the front of the queue"}, {"visible": "    NumberInQueue ← NumberInQueue – 1", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    IF NumberInQueue = 0", "tip": ""}, {"visible": "    THEN // if queue empty, reset pointers", "tip": ""}, {"visible": "      CALL InitialiseQueue", "tip": ""}, {"visible": "    ELSE", "tip": ""}, {"visible": "      FrontOfQueuePointer ← FrontOfQueuePointer + 1", "tip": "// increment front of queue pointer"}, {"visible": "", "tip": ""}, {"visible": "      IF FrontOfQueuePointer > MaxQueueSize – 1", "tip": "// check for wrap-round"}, {"visible": "      THEN // wrap to beginning of array", "tip": ""}, {"visible": "        FrontOfQueuePointer ← 0", "tip": ""}, {"visible": "      ENDIF", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "  ENDIF", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "  RETURN Item", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "queueDequeuePython": {"kind": "python", "lines": [{"visible": "def queueDequeuePython():", "tip": "    \"\"\"\n    Removes one item from the front of the circular queue.\n\n    Returns:\n        The removed value.\n        If the queue is empty, returns -1 (sentinel value).\n    \"\"\""}, {"visible": "    global Queue, HeadPointer, TailPointer, NumberItems", "tip": ""}, {"visible": "    if NumberItems <= 0:", "tip": "# 1) Check for underflow (queue empty)"}, {"visible": "        return -1", "tip": ""}, {"visible": "    return_value = Queue[HeadPointer]", "tip": "# 2) Read the item at the head (front)"}, {"visible": "    HeadPointer += 1", "tip": "# 3) Move HeadPointer forward (wrap-round if needed)"}, {"visible": "    if HeadPointer >= MAX_QUEUE_SIZE:", "tip": ""}, {"visible": "        HeadPointer = 0", "tip": ""}, {"visible": "    NumberItems -= 1", "tip": "# 4) Decrease the item count because one item was removed"}, {"visible": "    if NumberItems == 0:", "tip": "# 5) If the queue becomes empty, reset both pointers"}, {"visible": "        HeadPointer = -1", "tip": ""}, {"visible": "        TailPointer = -1", "tip": ""}, {"visible": "    return return_value", "tip": "# 6) Return the removed item"}]}, "binaryTreeInitialisePseudo": {"kind": "pseudo", "lines": [{"visible": "CONSTANT NullPointer = -1", "tip": "// NullPointer should be set to -1 if using array element with index 0"}, {"visible": "", "tip": ""}, {"visible": "TYPE TreeNode", "tip": "// Declare record type to store data and pointers"}, {"visible": "  DECLARE Data : STRING", "tip": ""}, {"visible": "  DECLARE LeftPointer : INTEGER", "tip": ""}, {"visible": "  DECLARE RightPointer : INTEGER", "tip": ""}, {"visible": "ENDTYPE", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "DECLARE RootPointer : INTEGER", "tip": ""}, {"visible": "DECLARE FreePtr : INTEGER", "tip": ""}, {"visible": "DECLARE Tree : ARRAY[0 : 6] OF TreeNode", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "PROCEDURE InitialiseTree", "tip": ""}, {"visible": "  RootPointer ← NullPointer // set start pointer", "tip": ""}, {"visible": "  FreePtr ← 0 // set starting position of free list", "tip": ""}, {"visible": "  FOR Index ← 0 TO 5 // link all nodes to make free list", "tip": ""}, {"visible": "    Tree[Index].LeftPointer ← Index + 1", "tip": ""}, {"visible": "  NEXT Index", "tip": ""}, {"visible": "  Tree[6].LeftPointer ← NullPointer // last node of free list", "tip": ""}, {"visible": "ENDPROCEDURE", "tip": ""}]}, "binaryTreeInsertPseudo": {"kind": "pseudo", "lines": [{"visible": "PROCEDURE InsertNode(NewItem)", "tip": ""}, {"visible": "  IF FreePtr <> NullPointer", "tip": ""}, {"visible": "  THEN // there is space in the array", "tip": ""}, {"visible": "    NewNodePtr ← FreePtr", "tip": "// take node from free list, store data item, set null pointers"}, {"visible": "    FreePtr ← Tree[FreePtr].LeftPointer", "tip": ""}, {"visible": "    Tree[NewNodePtr].Data ← NewItem", "tip": ""}, {"visible": "    Tree[NewNodePtr].LeftPointer ← NullPointer", "tip": ""}, {"visible": "    Tree[NewNodePtr].RightPointer ← NullPointer", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "    IF RootPointer = NullPointer", "tip": "// check if empty tree"}, {"visible": "    THEN // insert new node at root", "tip": ""}, {"visible": "      RootPointer ← NewNodePtr", "tip": ""}, {"visible": "    ELSE // find insertion point", "tip": ""}, {"visible": "      ThisNodePtr ← RootPointer // start at the root of the tree", "tip": ""}, {"visible": "      WHILE ThisNodePtr <> NullPointer DO // while not a leaf node", "tip": ""}, {"visible": "        PreviousNodePtr ← ThisNodePtr // remember this node", "tip": ""}, {"visible": "        IF Tree[ThisNodePtr].Data > NewItem", "tip": ""}, {"visible": "        THEN // follow left pointer", "tip": ""}, {"visible": "          TurnedLeft ← TRUE", "tip": ""}, {"visible": "          ThisNodePtr ← Tree[ThisNodePtr].LeftPointer", "tip": ""}, {"visible": "        ELSE // follow right pointer", "tip": ""}, {"visible": "          TurnedLeft ← FALSE", "tip": ""}, {"visible": "          ThisNodePtr ← Tree[ThisNodePtr].RightPointer", "tip": ""}, {"visible": "        ENDIF", "tip": ""}, {"visible": "      ENDWHILE", "tip": ""}, {"visible": "", "tip": ""}, {"visible": "      IF TurnedLeft = TRUE", "tip": ""}, {"visible": "      THEN", "tip": ""}, {"visible": "        Tree[PreviousNodePtr].LeftPointer ← NewNodePtr", "tip": ""}, {"visible": "      ELSE", "tip": ""}, {"visible": "        Tree[PreviousNodePtr].RightPointer ← NewNodePtr", "tip": ""}, {"visible": "      ENDIF", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "  ENDIF", "tip": ""}, {"visible": "ENDPROCEDURE", "tip": ""}]}, "binaryTreeFindPseudo": {"kind": "pseudo", "lines": [{"visible": "FUNCTION FindNode(SearchItem) RETURNS INTEGER // returns pointer to node", "tip": ""}, {"visible": "  ThisNodePtr ← RootPointer // start at the root of the tree", "tip": ""}, {"visible": "  WHILE ThisNodePtr <> NullPointer // while a pointer to follow", "tip": ""}, {"visible": "    AND Tree[ThisNodePtr].Data <> SearchItem DO // and search item not found", "tip": ""}, {"visible": "    IF Tree[ThisNodePtr].Data > SearchItem", "tip": ""}, {"visible": "    THEN // follow left pointer", "tip": ""}, {"visible": "      ThisNodePtr ← Tree[ThisNodePtr].LeftPointer", "tip": ""}, {"visible": "    ELSE // follow right pointer", "tip": ""}, {"visible": "      ThisNodePtr ← Tree[ThisNodePtr].RightPointer", "tip": ""}, {"visible": "    ENDIF", "tip": ""}, {"visible": "  ENDWHILE", "tip": ""}, {"visible": "  RETURN ThisNodePtr // will return null pointer if search item not found", "tip": ""}, {"visible": "ENDFUNCTION", "tip": ""}]}, "binaryTreeInitialisePython": {"kind": "python", "lines": [{"visible": "def binaryTreeInitialisePython(max_nodes: int = 20):", "tip": "    \"\"\"\n    Create an empty binary search tree stored in an array.\n\n    Each node is stored as:\n        ArrayNodes[index] = [LeftPointer, Data, RightPointer]\n\n    Pointer value -1 means \"null pointer\" (no child).\n    RootPointer is the index of the root node, or -1 if the tree is empty.\n    FreeNode is the index of the next free row in ArrayNodes.\n    \"\"\""}, {"visible": "    ArrayNodes = [[-1, -1, -1] for _ in range(max_nodes)]", "tip": "# Create the array that will hold all nodes (fixed size)\n# [-1, -1, -1] means unused node"}, {"visible": "    RootPointer = -1", "tip": "# Start with an empty tree, so there is no root yet"}, {"visible": "    FreeNode = 0", "tip": "# The first free node is at index 0"}, {"visible": "    return ArrayNodes, RootPointer, FreeNode", "tip": "# Return all structures so they can be used by insert/search routines"}]}, "binaryTreeInsertPython": {"kind": "python", "lines": [{"visible": "def binaryTreeInsertPython(ArrayNodes, RootPointer: int, FreeNode: int, NodeData: int):", "tip": "    \"\"\"\n    Insert one integer value into the binary search tree.\n\n    Returns:\n        ArrayNodes, RootPointer, FreeNode, Success\n    where Success is True if insertion happened, False if the array is full.\n    \"\"\""}, {"visible": "    max_nodes = len(ArrayNodes)", "tip": "# maximum number of nodes that can be stored"}, {"visible": "    if FreeNode >= max_nodes:", "tip": "# Check if there is space to insert a new node"}, {"visible": "        return ArrayNodes, RootPointer, FreeNode, False", "tip": "# no space"}, {"visible": "    ArrayNodes[FreeNode][0] = -1", "tip": "# Initialise the new node at index FreeNode\n# LeftPointer: no left child yet"}, {"visible": "    ArrayNodes[FreeNode][1] = NodeData", "tip": "# Data: store the value being inserted"}, {"visible": "    ArrayNodes[FreeNode][2] = -1", "tip": "# RightPointer: no right child yet"}, {"visible": "    if RootPointer == -1:", "tip": "# Case 1: tree is empty, so the new node becomes the root"}, {"visible": "        RootPointer = FreeNode", "tip": ""}, {"visible": "    else:", "tip": ""}, {"visible": "        Placed = False", "tip": "# Case 2: tree is not empty, so find where to attach the new node\n# becomes True when we attach the new node"}, {"visible": "        CurrentNode = RootPointer", "tip": "# start at the root"}, {"visible": "        while not Placed:", "tip": "# Repeat until we find a missing child pointer (-1) where we can attach"}, {"visible": "            if NodeData < ArrayNodes[CurrentNode][1]:", "tip": "# If new value is smaller, move left"}, {"visible": "                if ArrayNodes[CurrentNode][0] == -1:", "tip": "# If there is no left child, attach the new node here"}, {"visible": "                    ArrayNodes[CurrentNode][0] = FreeNode", "tip": ""}, {"visible": "                    Placed = True", "tip": ""}, {"visible": "                else:", "tip": ""}, {"visible": "                    CurrentNode = ArrayNodes[CurrentNode][0]", "tip": "# Follow the left pointer and continue searching for a place"}, {"visible": "            else:", "tip": ""}, {"visible": "                if ArrayNodes[CurrentNode][2] == -1:", "tip": "# Otherwise (equal or larger), move right\n# If there is no right child, attach the new node here"}, {"visible": "                    ArrayNodes[CurrentNode][2] = FreeNode", "tip": ""}, {"visible": "                    Placed = True", "tip": ""}, {"visible": "                else:", "tip": ""}, {"visible": "                    CurrentNode = ArrayNodes[CurrentNode][2]", "tip": "# Follow the right pointer and continue searching for a place"}, {"visible": "    FreeNode = FreeNode + 1", "tip": "# Move FreeNode to the next free position for the next insertion"}, {"visible": "    return ArrayNodes, RootPointer, FreeNode, True", "tip": "# Insertion succeeded"}]}, "binaryTreeFindPython": {"kind": "python", "lines": [{"visible": "def binaryTreeFindPython(ArrayNodes, RootPointer: int, SearchItem: int) -> int:", "tip": "    \"\"\"\n    Search for SearchItem in the binary search tree.\n\n    Returns:\n        - the array index of the node containing SearchItem, if found\n        - -1 if SearchItem is not in the tree\n    \"\"\""}, {"visible": "    CurrentNode = RootPointer", "tip": "# Start searching from the root node"}, {"visible": "    while CurrentNode != -1 and ArrayNodes[CurrentNode][1] != SearchItem:", "tip": "# Keep following pointers while:\n#   - we have not fallen off the tree (CurrentNode != -1)\n#   - and we have not found the value yet"}, {"visible": "        if SearchItem < ArrayNodes[CurrentNode][1]:", "tip": "# Decide which branch to follow based on the ordered-tree rule"}, {"visible": "            CurrentNode = ArrayNodes[CurrentNode][0]", "tip": "# Move to the left child"}, {"visible": "        else:", "tip": ""}, {"visible": "            CurrentNode = ArrayNodes[CurrentNode][2]", "tip": "# Move to the right child"}, {"visible": "    return CurrentNode", "tip": "# Either CurrentNode is the index where the value was found,\n# or it is -1 (null pointer) meaning \"not found\""}]}};
  var annexTitles = {"LinearSearchPseudo": "1) Linear search (algorithm idea)", "LinearSearchPython": "1) Linear search (algorithm idea)", "BinarySearchPseudo": "2) Binary search (algorithm idea)", "BinarySearchPython": "2) Binary search (algorithm idea)", "InsertionSortPseudo": "1) Insertion sort (algorithm idea)", "InsertionSortPython": "1) Insertion sort (algorithm idea)", "BubbleSortPseudo": "2) Bubble sort (algorithm idea)", "BubbleSortPython": "2) Bubble sort (algorithm idea)", "linkedInitialisePseudo": "Annex: linkedInitialisePseudo", "linkedInitialisePython": "Annex: linkedInitialisePython", "linkedFindPseudo": "Annex: linkedFindPseudo", "linkedFindPython": "Annex: linkedFindPython", "linkedInsertPseudo": "Annex: linkedInsertPseudo", "linkedInsertPython": "Annex: linkedInsertPython", "linkedDeletePseudo": "Annex: linkedDeletePseudo", "linkedDeletePython": "Annex: linkedDeletePython", "stackInitialisePseudo": "Annex: stackInitialisePseudo", "stackIsEmptyPseudo": "Annex: stackIsEmptyPseudo", "stackIsFullPseudo": "Annex: stackIsFullPseudo", "stackPushPseudo": "Annex: stackPushPseudo", "stackPopPseudo": "Annex: stackPopPseudo", "stackInitialisePython": "Annex: stackInitialisePython", "stackIsEmptyPython": "Annex: stackIsEmptyPython", "stackIsFullPython": "Annex: stackIsFullPython", "stackPushPython": "Annex: stackPushPython", "stackPopPython": "Annex: stackPopPython", "queueInitialisePseudo": "Algorithm 1: Initialise a queue", "queueInitialisePython": "Annex: queueInitialisePython", "queueEnqueuePseudo": "Algorithm 2: Add an item (enQueue)", "queueEnqueuePython": "Annex: queueEnqueuePython", "queueDequeuePseudo": "Algorithm 3: Remove an item (deQueue)", "queueDequeuePython": "Annex: queueDequeuePython", "binaryTreeInitialisePseudo": "Annex: binaryTreeInitialisePseudo", "binaryTreeInsertPseudo": "Annex: binaryTreeInsertPseudo", "binaryTreeFindPseudo": "Annex: binaryTreeFindPseudo", "binaryTreeInitialisePython": "Annex: binaryTreeInitialisePython", "binaryTreeInsertPython": "Annex: binaryTreeInsertPython", "binaryTreeFindPython": "Annex: binaryTreeFindPython"};
  function qs(id){ return document.getElementById(id); }

  function algorithmContext(aid){
    var s = String(aid || "").toLowerCase();
    if(s.indexOf("binarysearch") >= 0) return "binary search";
    if(s.indexOf("linearsearch") >= 0) return "linear search";
    if(s.indexOf("bubblesort") >= 0) return "bubble sort";
    if(s.indexOf("insertionsort") >= 0) return "insertion sort";
    if(s.indexOf("linked") >= 0) return "linked list";
    if(s.indexOf("stack") >= 0) return "stack";
    if(s.indexOf("queue") >= 0) return "queue";
    if(s.indexOf("binarytree") >= 0) return "binary tree";
    return "";
  }

  
  function algorithmOverview(id){
    // Intentionally removed: the code modal should focus on the code and line-by-line explanations only.
    // Purpose/approach text is handled elsewhere in the theory notes.
    return "";
}

function isPythonAssignment(t){
    if(!t) return false;
    if(t.indexOf("=") === -1) return false;
    if(t.indexOf("==") !== -1) return false;
    if(t.indexOf(">=") !== -1) return false;
    if(t.indexOf("<=") !== -1) return false;
    if(t.indexOf("!=") !== -1) return false;
    if(/^def\s+/.test(t)) return false;
    return true;
  }

  function generateTip(aid, kind, line){
    var raw = String(line || "");
    var t = raw.trim();
    if(!t) return "";

    // Preserve explicit comments inside the code
    if(t.indexOf("//") === 0){
      var c = t.replace(/^\/\/\s*/, "");
      return c ? ("Comment: " + c) : "";
    }
    if(t.indexOf("#") === 0){
      var c2 = t.replace(/^#\s*/, "");
      return c2 ? ("Comment: " + c2) : "";
    }

    var ctx = algorithmContext(aid);
    var low = t.toLowerCase();

    function inBinarySearch(){ return ctx === "binary search"; }
    function inLinearSearch(){ return ctx === "linear search"; }
    function inBubbleSort(){ return ctx === "bubble sort"; }
    function inInsertionSort(){ return ctx === "insertion sort"; }
    function inStack(){ return ctx === "stack"; }
    function inQueue(){ return ctx === "queue"; }
    function inLinkedList(){ return ctx === "linked list"; }
    function inBinaryTree(){ return ctx === "binary tree"; }

    // Algorithm-specific explanations
    if(kind === "pseudo"){
      if(inBinarySearch()){
        if(/^while\b/i.test(t)) return "Repeat while there is still a valid search range (First <= Last) and the item has not been found yet.";
        if(/middle\s*←/i.test(t) && low.indexOf("div") !== -1) return "Compute Middle as the middle index of the current search range [First .. Last]. This Middle is updated every loop iteration.";
        if(/if\s+list\[middle\]\s*=\s*searchitem\s+then/i.test(t)) return "If the item at the current Middle position equals SearchItem, then the search is successful and the algorithm can stop searching.";
                if(/found\s*←\s*false/i.test(low)) return "Set Found to FALSE at the start so the WHILE loop runs. Found becomes TRUE only when List[Middle] matches SearchItem.";
if(/found\s*←\s*true/i.test(low)) return "Set Found to TRUE because the SearchItem has just been matched. This prevents the WHILE loop from running again.";
        if(/searchitem\s*<\s*list\[middle\]/i.test(low)) return "If SearchItem is smaller than List[Middle], it can only be in the left half of the current range.";
        if(/searchitem\s*>\s*list\[middle\]/i.test(low)) return "If SearchItem is larger than List[Middle], it can only be in the right half of the current range.";
        if(/last\s*←\s*middle\s*-\s*1/i.test(low)) return "Shrink the search range to the left half by moving Last to Middle - 1, since the right half cannot contain SearchItem.";
        if(/first\s*←\s*middle\s*\+\s*1/i.test(low)) return "Shrink the search range to the right half by moving First to Middle + 1, since the left half cannot contain SearchItem.";
        if(/^output\b/i.test(low) && low.indexOf("found") !== -1) return "Report whether the search was successful after the loop ends.";
      }

      if(inLinearSearch()){
        if(/^while\b/i.test(t)) return "Scan through the list from the current index until the item is found or the end of the list is reached.";
        if(/if\s+list\[\s*index\s*\]\s*=\s*searchitem\s+then/i.test(low)) return "Compare the current list element with SearchItem. If they match, the search is successful and the loop can stop.";
        if(/found\s*←\s*true/i.test(low)) return "Mark the search as successful so the loop can stop and the result can be reported.";
        if(/index\s*←\s*index\s*\+\s*1/i.test(low)) return "Move to the next list position because the current item is not SearchItem.";
      }

      if(inBubbleSort()){
        if(/^for\b/i.test(low) && low.indexOf("pass") !== -1) return "Start a pass through the list. Each pass moves the largest remaining unsorted item toward the end.";
        if(/^if\b/i.test(low) && low.indexOf(">") !== -1 && low.indexOf("list[") !== -1) return "Compare two adjacent items. If they are in the wrong order, swap them so larger values move right.";
        if(low.indexOf("swap") !== -1) return "Swap the two adjacent items so the pair is in ascending order.";
      }

      if(inInsertionSort()){
        if(low.indexOf("itemtoinsert") !== -1 && t.indexOf("←") !== -1) return "Store the current item as ItemToInsert. This item will be inserted into the correct position in the sorted left section.";
        if(low.indexOf("pointer") !== -1 && t.indexOf("←") !== -1) return "Set Pointer to look left through the sorted section to find where ItemToInsert should go.";
        if(/^while\b/i.test(low) && low.indexOf("pointer") !== -1 && low.indexOf("itemtoinsert") !== -1) return "Move left while items are still larger than ItemToInsert. This finds the insertion position.";
        if(low.indexOf("list[pointer + 1]") !== -1 && t.indexOf("←") !== -1) return "Shift the larger item one place to the right to make space for ItemToInsert.";
        if(low.indexOf("list[pointer + 1]") !== -1 && low.indexOf("itemtoinsert") !== -1) return "Insert ItemToInsert into the newly created gap so the left section remains sorted.";
      }

      if(inStack()){
        if(low.indexOf("maxstacksize") !== -1 && t.indexOf("←") !== -1) return "Set MaxStackSize, the maximum number of items the stack array can hold.";
        if(low.indexOf("nullpointer") !== -1 && t.indexOf("←") !== -1) return "Define NullPointer as -1. This special value is used to represent 'no valid position' in the stack.";
        if(low.indexOf("baseofstackpointer") !== -1 && t.indexOf("←") !== -1) return "Set BaseOfStackPointer to the first valid array index for the stack (0 in this implementation).";
        if(low.indexOf("topofstackpointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("nullpointer") !== -1 || low.indexOf("−1") !== -1 || low.indexOf("-1") !== -1)) return "Set TopOfStackPointer to NullPointer (-1). This means the stack is empty because there is no top item yet.";
        if(/^if\b/i.test(t) && low.indexOf("topofstackpointer") !== -1 && low.indexOf("= nullpointer") !== -1) return "Check whether the stack is empty. If TopOfStackPointer is NullPointer, there are no items to pop.";
        if(/^if\b/i.test(t) && low.indexOf("topofstackpointer") !== -1 && (low.indexOf(">= maxstacksize - 1") !== -1 || low.indexOf(">= maxstacksize − 1") !== -1)) return "Check whether the stack is full. MaxStackSize - 1 is the last valid index in a 0-based array.";
        if(/^if\b/i.test(t) && low.indexOf("topofstackpointer") !== -1 && (low.indexOf("< maxstacksize - 1") !== -1 || low.indexOf("< maxstacksize − 1") !== -1)) return "Check that there is space to push a new item (TopOfStackPointer must be below the last valid index).";
        if(low.indexOf("topofstackpointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("topofstackpointer + 1") !== -1 || low.indexOf("topofstackpointer + 1") !== -1)) return "Move TopOfStackPointer up by 1. This selects the next free array cell where the new item will be stored.";
        if(low.indexOf("stack[") !== -1 && t.indexOf("←") !== -1) return "Store the new item in Stack[TopOfStackPointer]. This position is now the top of the stack.";
        if(low.indexOf("item") !== -1 && low.indexOf("stack[") !== -1 && t.indexOf("←") !== -1) return "Copy the current top item from the stack into Item so it can be returned to the caller.";
        if(low.indexOf("topofstackpointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("topofstackpointer - 1") !== -1 || low.indexOf("topofstackpointer − 1") !== -1)) return "Move TopOfStackPointer down by 1 to remove the top item from the stack.";
        if(/^return\b/i.test(t) && low.indexOf("true") !== -1) return "Return TRUE to report that the tested condition is satisfied.";
        if(/^return\b/i.test(t) && low.indexOf("false") !== -1) return "Return FALSE to report that the tested condition is not satisfied.";
      }

      if(inQueue()){
        if(low.indexOf("maxqueuesize") !== -1 && t.indexOf("←") !== -1) return "Set MaxQueueSize, the maximum number of items the queue array can hold.";
        if(low.indexOf("nullpointer") !== -1 && t.indexOf("←") !== -1) return "Define NullPointer as -1. This is used to show the queue is empty and pointers are not currently valid.";
        if(low.indexOf("frontofqueuepointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("nullpointer") !== -1 || low.indexOf("-1") !== -1)) return "Initialise the front pointer to NullPointer to represent an empty queue (no front item).";
        if(low.indexOf("endofqueuepointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("nullpointer") !== -1 || low.indexOf("-1") !== -1)) return "Initialise the end pointer to NullPointer to represent an empty queue (no rear item).";
        if(low.indexOf("numberinqueue") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("0") !== -1)) return "Set NumberInQueue to 0 because the queue starts empty.";
        if(/^if\b/i.test(t) && low.indexOf("numberinqueue < maxqueuesize") !== -1) return "Check for space in the queue. If NumberInQueue is less than MaxQueueSize, enqueue is allowed.";
        if(low.indexOf("endofqueuepointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("endofqueuepointer + 1") !== -1)) return "Move the end pointer forward by 1 to select the position where the new item will be stored. On the first enqueue, this moves from -1 to 0.";
        if(/^if\b/i.test(t) && (low.indexOf("endofqueuepointer > maxqueuesize") !== -1 || low.indexOf("endofqueuepointer > maxqueuesize – 1") !== -1 || low.indexOf("endofqueuepointer > maxqueuesize - 1") !== -1)) return "If the end pointer goes past the last valid index, wrap it back to 0 (circular queue).";
        if(low.indexOf("endofqueuepointer") !== -1 && t.indexOf("←") !== -1 && low.trim().endsWith("← 0")) return "Wrap the end pointer to the beginning of the array so the queue can reuse free space (circular behaviour).";
        if(low.indexOf("queue[") !== -1 && t.indexOf("←") !== -1) return "Store the new item in the queue array at the position pointed to by EndOfQueuePointer (the rear).";
        if(low.indexOf("numberinqueue") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("numberinqueue + 1") !== -1)) return "Increase NumberInQueue because one item has been added.";
        if(/^if\b/i.test(t) && low.indexOf("numberinqueue > 0") !== -1) return "Check the queue is not empty before removing an item. If NumberInQueue is greater than 0, dequeue is allowed.";
        if(low.indexOf("item") !== -1 && low.indexOf("queue[frontofqueuepointer]") !== -1 && t.indexOf("←") !== -1) return "Read the front item from the queue. This is the item that will be removed and returned.";
        if(low.indexOf("numberinqueue") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("numberinqueue - 1") !== -1 || low.indexOf("numberinqueue – 1") !== -1 || low.indexOf("numberinqueue − 1") !== -1)) return "Decrease NumberInQueue because one item has been removed.";
        if(/^if\b/i.test(t) && low.indexOf("numberinqueue = 0") !== -1) return "If the queue becomes empty after the removal, reset pointers by calling the initialise procedure.";
        if(low.indexOf("frontofqueuepointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("frontofqueuepointer + 1") !== -1)) return "Move the front pointer forward because the front item has been removed.";
        if(/^if\b/i.test(t) && (low.indexOf("frontofqueuepointer > maxqueuesize") !== -1 || low.indexOf("frontofqueuepointer > maxqueuesize – 1") !== -1 || low.indexOf("frontofqueuepointer > maxqueuesize - 1") !== -1)) return "If the front pointer goes past the last valid index, wrap it back to 0 (circular queue).";
        if(low.indexOf("frontofqueuepointer") !== -1 && t.indexOf("←") !== -1 && low.trim().endsWith("← 0")) return "Wrap the front pointer to the beginning of the array.";
        if(/^return\b/i.test(t)) return "Return the removed item (or a default value if the queue was empty).";
      }

      if(inLinkedList()){
        if(low.indexOf("startpointer") !== -1 && t.indexOf("←") !== -1) return "Set StartPointer to the first node in the list. When StartPointer is NullPointer, the list is empty.";
        if(low.indexOf("freelistptr") !== -1 && t.indexOf("←") !== -1) return "Set FreeListPtr to the first free node. The free list links unused array positions so insert can reuse them.";
        if(/^for\b/i.test(low)) return "Loop through array positions to set up initial pointers and placeholders.";
        if(low.indexOf(".pointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("i + 1") !== -1 || low.indexOf("i+1") !== -1)) return "Link node i to the next free node (i+1). This builds the free list.";
        if(low.indexOf(".pointer") !== -1 && t.indexOf("←") !== -1 && low.indexOf("nullpointer") !== -1) return "Mark the end of the list or free list by setting the pointer to NullPointer (-1).";
        if(low.indexOf("currentptr") !== -1 && t.indexOf("←") !== -1) return "Set CurrentPtr to the node currently being examined while traversing the list.";
        if(/^while\b/i.test(low) && low.indexOf("nullpointer") !== -1) return "Repeat while there are still nodes to follow and the target item has not been found.";
        if(low.indexOf("currentptr ← list[currentptr].pointer") !== -1) return "Follow the pointer to move to the next node in the list.";
        if(low.indexOf("newptr") !== -1 && t.indexOf("←") !== -1 && low.indexOf("freelistptr") !== -1) return "Take the first free node from the free list to reuse it for the new item.";
        if(low.indexOf("freelistptr ← list[newptr].pointer") !== -1) return "Move FreeListPtr forward because the current free node is now being used in the list.";
        if(low.indexOf("list[newptr].data") !== -1 && t.indexOf("←") !== -1) return "Store the new item in the data field of the allocated node.";
        if(low.indexOf("list[newptr].pointer") !== -1 && t.indexOf("←") !== -1) return "Set the pointer field so the new node is linked into the list.";
        if(low.indexOf("startpointer") !== -1 && t.indexOf("←") !== -1 && low.indexOf("newptr") !== -1) return "Update StartPointer so the new node becomes the first node in the list.";
        if(/^return\b/i.test(t)) return "Return a result such as a pointer to a node or a success/failure flag.";
      }

      if(inBinaryTree()){
        if(low.indexOf("nullpointer") !== -1 && t.indexOf("←") !== -1) return "Define NullPointer as -1. This special value is used when a pointer does not link to a valid node.";
        if(low.indexOf("rootpointer") !== -1 && t.indexOf("←") !== -1 && low.indexOf("nullpointer") !== -1) return "Initialise RootPointer to NullPointer to represent an empty tree (no root yet).";
        if(low.indexOf("freeptr") !== -1 && t.indexOf("←") !== -1) return "Set FreePtr to the first free node index in the array. This is the start of the free list.";
        if(/^for\b/i.test(low) && low.indexOf("free list") !== -1) return "Link all unused nodes together to build the free list so new nodes can be allocated later.";
        if(low.indexOf("tree[index].leftpointer") !== -1 && t.indexOf("←") !== -1 && (low.indexOf("index + 1") !== -1 || low.indexOf("index + 1") !== -1)) return "Make each free node point to the next free node using its LeftPointer field (free list linking).";
        if(low.indexOf("tree[6].leftpointer") !== -1 && low.indexOf("nullpointer") !== -1) return "End the free list by setting the last free node's pointer to NullPointer.";
        if(/^if\b/i.test(low) && low.indexOf("freeptr <> nullpointer") !== -1) return "Check there is free space in the array. If FreePtr is not NullPointer, a new node can be allocated.";
        if(low.indexOf("newnodeptr") !== -1 && t.indexOf("←") !== -1 && low.indexOf("freeptr") !== -1) return "Allocate a new node by taking the first free node from the free list.";
        if(low.indexOf("freeptr ← tree[freeptr].leftpointer") !== -1) return "Move FreePtr to the next free node, because the current free node is now allocated.";
        if(low.indexOf("tree[newnodeptr].data") !== -1 && t.indexOf("←") !== -1) return "Store the new item into the Data field of the allocated node.";
        if(low.indexOf("tree[newnodeptr].leftpointer") !== -1 && low.indexOf("nullpointer") !== -1) return "Set the new node's left child pointer to NullPointer because it has no children yet.";
        if(low.indexOf("tree[newnodeptr].rightpointer") !== -1 && low.indexOf("nullpointer") !== -1) return "Set the new node's right child pointer to NullPointer because it has no children yet.";
        if(/^if\b/i.test(low) && low.indexOf("rootpointer = nullpointer") !== -1) return "Special case: if the tree is empty, make the new node the root by setting RootPointer to NewNodePtr.";
        if(low.indexOf("thisnodeptr") !== -1 && t.indexOf("←") !== -1 && low.indexOf("rootpointer") !== -1) return "Start at the root and move down the tree to find the correct insertion position.";
        if(/^while\b/i.test(low) && low.indexOf("thisnodeptr <> nullpointer") !== -1) return "Repeat while there is still a node to follow. When ThisNodePtr becomes NullPointer, we have reached a leaf position where insertion can occur.";
        if(low.indexOf("previousnodeptr") !== -1 && t.indexOf("←") !== -1) return "Keep track of the previous node so we can attach the new node as its left or right child after the loop.";
        if(low.indexOf("tree[thisnodeptr].data > newitem") !== -1) return "Compare values to decide direction. If the new item is smaller, follow the left pointer; otherwise follow the right pointer.";
        if(low.indexOf("turnedleft") !== -1 && (low.indexOf("true") !== -1 || low.indexOf("false") !== -1)) return "Record whether the last move was to the left or to the right. This tells us which child pointer to update when inserting.";
        if(low.indexOf("thisnodeptr ← tree[thisnodeptr].leftpointer") !== -1) return "Move to the left child and continue searching for an insertion point.";
        if(low.indexOf("thisnodeptr ← tree[thisnodeptr].rightpointer") !== -1) return "Move to the right child and continue searching for an insertion point.";
        if(/^if\b/i.test(low) && low.indexOf("turnedleft = true") !== -1) return "If the last move was left, attach the new node as the left child of PreviousNodePtr.";
        if(low.indexOf("tree[previousnodeptr].leftpointer") !== -1 && t.indexOf("←") !== -1) return "Link the new node as the left child of the previous node.";
        if(low.indexOf("tree[previousnodeptr].rightpointer") !== -1 && t.indexOf("←") !== -1) return "Link the new node as the right child of the previous node.";
        if(low.indexOf("findnode") !== -1 && low.indexOf("returns integer") !== -1) return "Define a search function that returns the pointer (array index) of the matching node, or NullPointer if not found.";
        if(low.indexOf("tree[thisnodeptr].data <> searchitem") !== -1) return "Continue searching while the current node does not contain the target value.";
        if(low.indexOf("tree[thisnodeptr].data > searchitem") !== -1) return "If the target is smaller than the current node, follow the left pointer.";
        if(low.indexOf("tree[thisnodeptr].data < searchitem") !== -1) return "If the target is larger than the current node, follow the right pointer.";
        if(/^return\b/i.test(t) && low.indexOf("thisnodeptr") !== -1) return "Return ThisNodePtr. It will be NullPointer if the item was not found, otherwise it is the index of the found node.";
      }

    }else if(kind === "python"){
      if(inBinarySearch()){
        if(/^while\b/.test(low)) return "Repeat while there is still a valid search range (first <= last) and the item has not been found yet.";
        if(low.indexOf("mid") !== -1 && (low.indexOf("//") !== -1 || low.indexOf("int(") !== -1) && low.indexOf("=") !== -1) return "Compute mid as the middle index of the current search range [first .. last]. This mid is updated every loop iteration.";
        if(/^if\b/.test(low) && low.indexOf("==") !== -1 && (low.indexOf("[mid]") !== -1 || low.indexOf("mid]") !== -1)) return "If the item at the current mid position equals searchItem, then the search is successful and the loop can stop.";
        if(low.indexOf("found") !== -1 && (low.indexOf("= true") !== -1 || low.indexOf("=true") !== -1)) return "Set found to True because the required item has just been matched. This prevents the while loop from iterating again.";
        if(/^elif\b/.test(low) && low.indexOf("<") !== -1 && low.indexOf("[mid]") !== -1) return "If searchItem is smaller than myList[mid], it can only be in the left half of the current range.";
        if(/^elif\b/.test(low) && low.indexOf(">") !== -1 && low.indexOf("[mid]") !== -1) return "If searchItem is larger than myList[mid], it can only be in the right half of the current range.";
        if(/^else\b/.test(low)) return "This branch handles the remaining case, typically when searchItem is larger than myList[mid], so the search range is moved to the right half.";
        if(low.indexOf("last") !== -1 && low.indexOf("mid") !== -1 && (low.indexOf("- 1") !== -1 || low.indexOf("-1") !== -1)) return "Move last to mid - 1 to discard the right half, because it cannot contain searchItem.";
        if(low.indexOf("first") !== -1 && low.indexOf("mid") !== -1 && (low.indexOf("+ 1") !== -1 || low.indexOf("+1") !== -1)) return "Move first to mid + 1 to discard the left half, because it cannot contain searchItem.";
      }

      if(inLinearSearch()){
        if(/^for\b/.test(low)) return "Scan the list from left to right, checking each item in turn.";
        if(/^while\b/.test(low)) return "Scan through the list while there are still items to check and the item has not been found yet.";
        if(/^if\b/.test(low) && low.indexOf("==") !== -1) return "Compare the current list item with searchItem. If they match, the search is successful.";
        if(low.indexOf("found") !== -1 && (low.indexOf("= true") !== -1 || low.indexOf("=true") !== -1)) return "Mark that the searchItem has been found so the loop can stop and the result can be reported.";
      }

      if(inBubbleSort()){
        if(/^for\b/.test(low) && low.indexOf("range") !== -1) return "Perform a pass through the list. Each pass pushes the largest remaining unsorted value toward the end.";
        if(/^if\b/.test(low) && low.indexOf(">") !== -1 && low.indexOf("[") !== -1) return "Compare adjacent items. If they are in the wrong order, swap them so larger values move right.";
      }

      if(inInsertionSort()){
        if((low.indexOf("key") !== -1 || low.indexOf("itemtoinsert") !== -1) && low.indexOf("=") !== -1) return "Store the current value as the key (item to insert). This value will be inserted into its correct position in the sorted left section.";
        if(/^while\b/.test(low) && (low.indexOf("key") !== -1 || low.indexOf("itemtoinsert") !== -1)) return "Shift larger items right until the correct position for the key is found.";
        if(low.indexOf("[j+1]") !== -1 && low.indexOf("=") !== -1) return "Move an item one place to the right to create space for the key.";
      }

      if(inStack()){
        if(/^def\b/.test(low)) return "Define this stack operation as a function so it can be called when needed.";
        if(/^global\b/.test(low)){
          var g = t.replace(/^\s*global\s+/i,"").trim();
          return "Use the global variable(s) " + g + " so this function can read and update the shared stack state used by other stack functions.";
        }
        if(low.indexOf("max_stack_size") !== -1 && isPythonAssignment(t)) return "Set the fixed maximum number of items allowed in the stack (stack capacity).";
        if(low.indexOf("empty_string") !== -1 && isPythonAssignment(t)) return "Define the placeholder stored in unused stack cells to show that a position is empty.";
        if(low.indexOf("stack") !== -1 && isPythonAssignment(t) && low.indexOf("[empty_string]") !== -1) return "Create the stack storage as a fixed-size list. +1 is used because this implementation stores items in positions 1..MAX_STACK_SIZE (index 0 is unused).";
        if(low.indexOf("basepointer") !== -1 && isPythonAssignment(t) && low.indexOf("= 1") !== -1) return "Set BasePointer to 1 so the first valid stack position is index 1 (this implementation uses 1-based positions).";
        if(low.indexOf("toppointer") !== -1 && isPythonAssignment(t) && (low.indexOf("= 0") !== -1)) return "Set TopPointer below BasePointer to represent an empty stack (no items have been pushed yet).";
        if(/^for\b/.test(low) && low.indexOf("range") !== -1) return "Loop through every valid stack position to clear old values and reset the stack to an empty state.";
        if(low.indexOf("stack[") !== -1 && low.indexOf("] = empty_string") !== -1) return "Clear this stack cell by writing EMPTY_STRING, so the array shows which positions are in use.";
        if(/^return\b/.test(low) && (low.indexOf("top") !== -1 || low.indexOf("toppointer") !== -1) && low.indexOf("<") !== -1) return "Return a Boolean result from the test function (for example, whether the stack is empty).";
        if(/^return\b/.test(low) && low.indexOf("toppointer") !== -1 && low.indexOf("== max_stack_size") !== -1) return "Return True if TopPointer is at the last valid position, meaning the stack is full.";
        if(/^if\b/.test(low) && low.indexOf("stackisfullpython") !== -1) return "Check for overflow: if the stack is full, a push cannot succeed.";
        if(low.indexOf("toppointer") !== -1 && isPythonAssignment(t) && (low.indexOf("toppointer + 1") !== -1 || low.indexOf("toppointer += 1") !== -1)) return "Move TopPointer up to the next free position. This new position will store the pushed item.";
        if(low.indexOf("stack[toppointer]") !== -1 && low.indexOf("=") !== -1 && low.indexOf("new") !== -1) return "Store the new item at the top of the stack (at Stack[TopPointer]).";
        if(/^return\b/.test(low) && low.indexOf("true") !== -1) return "Return True to show that the operation succeeded.";
        if(/^return\b/.test(low) && low.indexOf("false") !== -1) return "Return False to show that the operation failed (for example, because the stack was full).";
        if(/^if\b/.test(low) && low.indexOf("stackisemptypython") !== -1) return "Check for underflow: if the stack is empty, there is nothing to pop.";
        if(low.indexOf("item") !== -1 && isPythonAssignment(t) && low.indexOf("stack[toppointer]") !== -1) return "Copy the current top item into a variable so it can be returned after removing it from the stack.";
        if(low.indexOf("stack[toppointer]") !== -1 && low.indexOf("= empty_string") !== -1) return "Clear the cell that held the removed item, so the array matches the updated stack contents.";
        if(low.indexOf("toppointer") !== -1 && isPythonAssignment(t) && (low.indexOf("toppointer - 1") !== -1 || low.indexOf("toppointer -= 1") !== -1)) return "Move TopPointer down after popping, so the stack now has one fewer item.";
        if(/^return\b/.test(low) && low.indexOf("item") !== -1) return "Return the item that was removed from the stack.";
      }

      if(inQueue()){
        if(/^def\b/.test(low)) return "Define this queue operation as a function so it can be called when needed.";
        if(/^global\b/.test(low)){
          var g = t.replace(/^\s*global\s+/i,"").trim();
          return "Use the global variable(s) " + g + " so this function can read and update the shared queue state (array, pointers, and item count).";
        }
        if(low.indexOf("max_queue_size") !== -1 && isPythonAssignment(t)) return "Set the fixed maximum number of items allowed in the queue (queue capacity).";
        if(low.indexOf("queue") !== -1 && isPythonAssignment(t) && low.indexOf("* max_queue_size") !== -1) return "Create the queue storage as a fixed-size list with MAX_QUEUE_SIZE positions.";
        if(low.indexOf("headpointer") !== -1 && isPythonAssignment(t) && low.indexOf("= -1") !== -1) return "Set HeadPointer to -1 to represent an empty queue (no front item yet).";
        if(low.indexOf("tailpointer") !== -1 && isPythonAssignment(t) && low.indexOf("= -1") !== -1) return "Set TailPointer to -1 to represent an empty queue (no rear item yet).";
        if(low.indexOf("numberitems") !== -1 && isPythonAssignment(t) && low.indexOf("= 0") !== -1) return "Set NumberItems to 0 because the queue starts empty (no items stored).";
        if(/^if\b/.test(low) && low.indexOf("numberitems") !== -1 && low.indexOf(">= max_queue_size") !== -1) return "Check for overflow: if NumberItems equals the capacity, the queue is full and enqueue must fail.";
        if(/^if\b/.test(low) && low.indexOf("numberitems") !== -1 && (low.indexOf("<= 0") !== -1 || low.indexOf("== 0") !== -1) && low.indexOf("dequeue") !== -1) return "Check for underflow: if NumberItems is 0, the queue is empty and dequeue cannot remove an item.";
        if(/^if\b/.test(low) && low.indexOf("tailpointer") !== -1 && low.indexOf("== -1") !== -1) return "Special case: the queue is currently empty. Set both pointers to the first position before storing the first item.";
        if(low.indexOf("headpointer") !== -1 && isPythonAssignment(t) && low.indexOf("= 0") !== -1) return "Set HeadPointer to 0 because the first item will be at the front of the queue.";
        if(low.indexOf("tailpointer") !== -1 && isPythonAssignment(t) && low.indexOf("= 0") !== -1) return "Set TailPointer to 0 because the first item will also be at the rear of the queue.";
        if(/^if\b/.test(low) && low.indexOf("tailpointer") !== -1 && low.indexOf(">= max_queue_size - 1") !== -1) return "If TailPointer is at the last array index, wrap it back to 0 (circular queue).";
        if(low.indexOf("tailpointer") !== -1 && isPythonAssignment(t) && (low.indexOf("tailpointer + 1") !== -1 || low.indexOf("tailpointer += 1") !== -1)) return "Move TailPointer forward to the next position because a new item is being added.";
        if(low.indexOf("queue[tailpointer]") !== -1 && low.indexOf("=") !== -1) return "Store the new item at the position pointed to by TailPointer (the rear of the queue).";
        if(low.indexOf("numberitems") !== -1 && isPythonAssignment(t) && (low.indexOf("numberitems + 1") !== -1 || low.indexOf("numberitems += 1") !== -1)) return "Increase NumberItems because one item has been added.";
        if(low.indexOf("return_value") !== -1 && isPythonAssignment(t) && low.indexOf("queue[headpointer]") !== -1) return "Copy the front item (Queue[HeadPointer]) so it can be returned after it is removed.";
        if(low.indexOf("headpointer") !== -1 && isPythonAssignment(t) && (low.indexOf("headpointer + 1") !== -1 || low.indexOf("headpointer += 1") !== -1)) return "Move HeadPointer forward because the front item has been removed.";
        if(/^if\b/.test(low) && low.indexOf("headpointer") !== -1 && low.indexOf(">= max_queue_size") !== -1) return "If HeadPointer moves past the end of the array, wrap it back to 0 (circular queue).";
        if(low.indexOf("numberitems") !== -1 && isPythonAssignment(t) && (low.indexOf("numberitems - 1") !== -1 || low.indexOf("numberitems -= 1") !== -1)) return "Decrease NumberItems because one item has been removed.";
        if(/^if\b/.test(low) && low.indexOf("numberitems == 0") !== -1) return "If the queue becomes empty after the dequeue, reset both pointers to -1 to mark the empty state.";
        if(low.indexOf("headpointer") !== -1 && isPythonAssignment(t) && low.indexOf("= -1") !== -1) return "Reset HeadPointer to -1 to show the queue is empty.";
        if(low.indexOf("tailpointer") !== -1 && isPythonAssignment(t) && low.indexOf("= -1") !== -1) return "Reset TailPointer to -1 to show the queue is empty.";
        if(/^return\b/.test(low)) return "Return a value (for example, the removed item or a success/failure flag).";
      }

      if(inLinkedList()){
        if(/^def\b/.test(low)) return "Define this linked list operation as a function so it can be called when needed.";
        if(/^global\b/.test(low)){
          var g = t.replace(/^\s*global\s+/i,"").trim();
          return "Use the global variable(s) " + g + " so this function can read and update the shared linked list arrays and pointers.";
        }
        if(low.indexOf("null_pointer") !== -1 && isPythonAssignment(t)) return "Define a special value (-1) that represents 'no node'. It is used to mark the end of the list or an empty list.";
        if(low.indexOf("firstnode") !== -1 && isPythonAssignment(t) && low.indexOf("null_pointer") !== -1) return "Set FirstNode to NULL_POINTER to show the list is currently empty (no first node).";
        if(low.indexOf("firstempty") !== -1 && isPythonAssignment(t) && low.indexOf("= 0") !== -1) return "Set FirstEmpty to 0 so the first free node is at index 0 (start of the free list).";
        if(low.indexOf("append(") !== -1) return "Create a new node record in the array. Each node stores [data, pointer].";
        if(low.indexOf("linkedlist[i][1]") !== -1 && (low.indexOf("i + 1") !== -1 || low.indexOf("i+1") !== -1)) return "Link free nodes together so node i points to node i+1. This builds the free list.";
        if(low.indexOf("linkedlist[size - 1][1]") !== -1 && low.indexOf("null_pointer") !== -1) return "End the free list by setting the last free node's pointer to NULL_POINTER.";
        if(low.indexOf("current_ptr") !== -1 && isPythonAssignment(t) && low.indexOf("firstnode") !== -1) return "Start traversal at the first node of the list (the head).";
        if(/^while\b/.test(low) && low.indexOf("current_ptr") !== -1 && low.indexOf("null_pointer") !== -1) return "Move through the list until the end (NULL_POINTER) or until the target item is found.";
        if(low.indexOf("current_ptr = linkedlist[current_ptr][1]") !== -1) return "Follow the pointer from the current node to the next node.";
        if(low.indexOf("new_ptr") !== -1 && isPythonAssignment(t) && low.indexOf("firstempty") !== -1) return "Take the first free node from the free list. This node will be reused for the new item.";
        if(low.indexOf("firstempty") !== -1 && isPythonAssignment(t) && low.indexOf("linkedlist[new_ptr][1]") !== -1) return "Move FirstEmpty to the next free node, because the current free node is being used.";
        if(low.indexOf("linkedlist[new_ptr][0]") !== -1 && low.indexOf("=") !== -1) return "Store the new data value in the reused node.";
        if(low.indexOf("linkedlist[new_ptr][1]") !== -1 && low.indexOf("firstnode") !== -1) return "Point the new node to the current first node, so the new node becomes the new head of the list.";
        if(low.indexOf("firstnode") !== -1 && isPythonAssignment(t) && low.indexOf("new_ptr") !== -1) return "Update FirstNode so the new node is now the first node in the linked list.";
        if(low.indexOf("this_ptr") !== -1 && isPythonAssignment(t) && low.indexOf("firstnode") !== -1) return "Start searching from the first node. this_ptr is the node currently being checked.";
        if(low.indexOf("prev_ptr") !== -1 && isPythonAssignment(t) && low.indexOf("null_pointer") !== -1) return "Set prev_ptr to NULL_POINTER at the start because there is no previous node before the first node.";
        if(low.indexOf("prev_ptr = this_ptr") !== -1) return "Move prev_ptr forward so it stays one node behind this_ptr during traversal.";
        if(low.indexOf("this_ptr = linkedlist[this_ptr][1]") !== -1) return "Move this_ptr to the next node by following the pointer.";
        if(/^if\b/.test(low) && low.indexOf("this_ptr == null_pointer") !== -1) return "If this_ptr becomes NULL_POINTER, the item was not found in the list.";
        if(/^if\b/.test(low) && low.indexOf("this_ptr == firstnode") !== -1) return "Special case: deleting the first node. Move FirstNode to the next node to remove the head.";
        if(low.indexOf("linkedlist[prev_ptr][1]") !== -1) return "Bypass the node being deleted: make the previous node point to the node after the deleted one.";
        if(low.indexOf("linkedlist[this_ptr][1] = firstempty") !== -1) return "Add the deleted node back to the free list by making it point to the current first free node.";
        if(low.indexOf("firstempty = this_ptr") !== -1) return "Update FirstEmpty so the deleted node becomes the new first free node.";
        if(/^return\b/.test(low)) return "Return a result such as a pointer index or a success/failure flag.";
      }

      if(inBinaryTree()){
        if(/^def\b/.test(low)) return "Define this binary tree operation as a function so it can be reused (initialise, insert, or find).";
        if(low.indexOf("arraynodes") !== -1 && isPythonAssignment(t) && low.indexOf("for _ in range") !== -1) return "Create the array that stores all tree nodes. Each node uses three fields: left index, data value, right index. A value of -1 means 'no child'.";
        if(low.indexOf("rootpointer") !== -1 && isPythonAssignment(t) && low.indexOf("= -1") !== -1) return "Set RootPointer to -1 to represent an empty tree (there is no root node yet).";
        if(low.indexOf("freenode") !== -1 && isPythonAssignment(t) && low.indexOf("= 0") !== -1) return "Set FreeNode to 0. This is the index of the next unused slot in ArrayNodes for a new node.";
        if(low.indexOf("max_nodes") !== -1 && isPythonAssignment(t) && low.indexOf("len(arraynodes)") !== -1) return "Find the maximum number of nodes available so we can detect when the array is full.";
        if(/^if\b/.test(low) && low.indexOf("freenode") !== -1 && low.indexOf(">= max_nodes") !== -1) return "Check for overflow: if FreeNode reaches max_nodes, the array is full and insertion cannot continue.";
        if(low.indexOf("arraynodes[freenode][0]") !== -1 && low.indexOf("= -1") !== -1) return "Initialise the left pointer of the new node to -1 (no left child yet).";
        if(low.indexOf("arraynodes[freenode][1]") !== -1 && low.indexOf("= nodedata") !== -1) return "Store NodeData (the value being inserted) into the data field of the new node.";
        if(low.indexOf("arraynodes[freenode][2]") !== -1 && low.indexOf("= -1") !== -1) return "Initialise the right pointer of the new node to -1 (no right child yet).";
        if(/^if\b/.test(low) && low.indexOf("rootpointer") !== -1 && low.indexOf("== -1") !== -1) return "Special case: the tree is empty. Make the new node the root by setting RootPointer to FreeNode.";
        if(low.indexOf("placed") !== -1 && isPythonAssignment(t) && low.indexOf("false") !== -1) return "Use a flag (Placed) to control the loop. It stays False until the new node has been attached as a left or right child.";
        if(low.indexOf("currentnode") !== -1 && isPythonAssignment(t) && low.indexOf("rootpointer") !== -1) return "Start at the root. CurrentNode will move down the tree to find the correct insertion point.";
        if(/^while\b/.test(low) && low.indexOf("not placed") !== -1) return "Repeat until the new node has been placed in the correct position.";
        if(low.indexOf("nodedata < arraynodes[currentnode][1]") !== -1) return "Compare values. If NodeData is smaller than the current node's value, go to the left subtree.";
        if(low.indexOf("arraynodes[currentnode][0] == -1") !== -1) return "If the current node has no left child, attach the new node here as the left child.";
        if(low.indexOf("arraynodes[currentnode][0] = freenode") !== -1) return "Store FreeNode in the left pointer field to link the new node as the left child.";
        if(low.indexOf("currentnode = arraynodes[currentnode][0]") !== -1) return "Move to the left child and continue searching for an empty position.";
        if(low.indexOf("arraynodes[currentnode][2] == -1") !== -1) return "If the current node has no right child, attach the new node here as the right child.";
        if(low.indexOf("arraynodes[currentnode][2] = freenode") !== -1) return "Store FreeNode in the right pointer field to link the new node as the right child.";
        if(low.indexOf("currentnode = arraynodes[currentnode][2]") !== -1) return "Move to the right child and continue searching for an empty position.";
        if(low.indexOf("freenode = freenode + 1") !== -1 || low.indexOf("freenode += 1") !== -1) return "Increase FreeNode so it points to the next unused array position for the next insertion.";
        if(low.indexOf("currentnode = rootpointer") !== -1) return "Start searching from the root. CurrentNode will move down the tree toward the target.";
        if(/^while\b/.test(low) && low.indexOf("currentnode != -1") !== -1 && low.indexOf("!= searchitem") !== -1) return "Repeat while we have not reached an empty child (-1) and the current node does not contain SearchItem.";
        if(low.indexOf("searchitem < arraynodes[currentnode][1]") !== -1) return "If the target value is smaller than the current node, move left because smaller values are stored in the left subtree.";
        if(low.indexOf("searchitem > arraynodes[currentnode][1]") !== -1) return "If the target value is larger than the current node, move right because larger values are stored in the right subtree.";
        if(/^return\b/.test(low) && low.indexOf("currentnode") !== -1) return "Return the node index: -1 means not found; otherwise it is the index of the found node.";
      }

    }

    // Generic fallback explanations (used only if no specific rule matched)
    if(kind === "python"){
      var m = t.match(/^def\s+([A-Za-z_]\w*)\s*\(/);
      if(m) return "Define function " + m[1] + "(...).";
      if(/^global\b/.test(low)){
        var g = t.replace(/^\s*global\s+/i,"").trim();
        return "Use the global variable(s) " + g + " so this function can update shared state used outside this function.";
      }
      if(/^return\b/.test(low)) return "Return a value from the function after completing the algorithm steps.";
      if(/^for\b/.test(low)) return ctx ? ("Loop step in " + ctx + ".") : "Start a loop.";
      if(/^while\b/.test(low)) return ctx ? ("Loop step in " + ctx + ".") : "Start a loop.";
      if(/^if\b/.test(low) || /^elif\b/.test(low) || /^else\b/.test(low)) return ctx ? ("Decision step in " + ctx + ".") : "Make a decision based on a condition.";
      if(t.indexOf("print(") !== -1) return "Output a value to the screen.";
      if(isPythonAssignment(t)){
        var left = t.split("=")[0].trim();
        return ctx ? ("Update " + left + " as part of the " + ctx + " process.") : ("Assign a value to " + left + ".");
      }
      return ctx ? ("Algorithm step in " + ctx + ".") : "Algorithm step.";
    }

    // Pseudocode fallback
    if(/^FUNCTION\b/i.test(t)) return "Define a function.";
    if(/^PROCEDURE\b/i.test(t)) return "Define a procedure.";
    if(/^WHILE\b/i.test(t)) return "Repeat the following steps while the condition is true.";
    if(/^IF\b/i.test(t)) return ctx ? ("Decision step in " + ctx + ".") : "Make a decision based on the condition.";
    if(/^ELSE\b/i.test(t)) return "Alternative branch when the IF condition is false.";
    if(/^FOR\b/i.test(t)) return "Repeat the following steps a fixed number of times.";
    if(t.indexOf("←") !== -1) return ctx ? ("Update a variable as part of the " + ctx + " process.") : "Assign a value to a variable.";
    return ctx ? ("Algorithm step in " + ctx + ".") : "Algorithm step.";
  }

  function renderTipPanel(panel, text){
    if(!panel) return;
    if(!text){
      panel.innerHTML = "<div class='tip-placeholder'>Hover over a code line to see an explanation here.</div>";
      return;
    }
    panel.innerHTML = "<div class='tip-title'>Explanation</div><div class='tip-text'></div><div class='tip-hint'>Click a line to pin, click again to unpin.</div>";
    var t = panel.querySelector(".tip-text");
    if(t) t.textContent = text;
  }

  function attachLineInteractions(container, panel){
    if(!container || !panel) return;
    var pinned = null;
    renderTipPanel(panel, "");
    container.querySelectorAll(".code-line").forEach(function(line){
      line.addEventListener("mouseenter", function(){
        if(pinned) return;
        renderTipPanel(panel, line.getAttribute("data-tip") || "");
      });
      line.addEventListener("click", function(){
        var text = line.getAttribute("data-tip") || "";
        if(!text) return;
        if(pinned === line){
          line.classList.remove("pinned");
          pinned = null;
          renderTipPanel(panel, "");
          return;
        }
        if(pinned) pinned.classList.remove("pinned");
        pinned = line;
        line.classList.add("pinned");
        renderTipPanel(panel, text);
      });
    });
  }

  function enrichStaticCodeTips(){
    document.querySelectorAll(".code-wrap").forEach(function(wrap){
      var aid = wrap.getAttribute("id") || "";
      var kind = wrap.classList.contains("python") ? "python" : "pseudo";
      wrap.querySelectorAll(".code-line").forEach(function(line){
        if(line.hasAttribute("data-tip")) return;
        var text = line.textContent || "";
        var tip = generateTip(aid, kind, text);
        if(tip) line.setAttribute("data-tip", tip);
      });
    });
  }


  function buildCodeHtml(aid){
    var item = annexData[aid];
    if(!item) return null;
    var kind = item.kind;
    var wrap = document.createElement("div");
    wrap.className = "code-wrap " + kind;
    (item.lines || []).forEach(function(ln){
      var div = document.createElement("div");
      div.className = "code-line";
      var text = (ln.visible || "");
      div.textContent = text;
      var tipText = (ln.tip || generateTip(aid, kind, text));
      if(tipText) div.setAttribute("data-tip", tipText);
      wrap.appendChild(div);
    });
    return wrap;
  }
  function openModal(aid){
    var bd = qs("annexModalBackdrop");
    var title = qs("annexModalTitle");
    var subtitle = qs("annexModalSubtitle");
    var codeWrap = qs("annexModalCodeWrap");
    var panel = qs("modalTipPanel");
    if(!bd || !title || !codeWrap || !panel) return false;

    codeWrap.innerHTML = "";
    title.textContent = aid;
    if(subtitle) subtitle.textContent = algorithmOverview(aid);

    panel.classList.add("visible");
    panel.classList.remove("pinned");
    panel.innerHTML = "<div class='tip-placeholder'>Hover over a code line to see an explanation here.</div>";

    var code = buildCodeHtml(aid);
    if(!code) return false;
    codeWrap.appendChild(code);

    attachLineInteractions(codeWrap, panel);

    bd.classList.add("open");
    bd.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    return true;
  }
  function closeModal(){
    var bd = qs("annexModalBackdrop");
    var codeWrap = qs("annexModalCodeWrap");
    var panel = qs("modalTipPanel");
    if(!bd) return;
    bd.classList.remove("open");
    bd.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
    if(codeWrap) codeWrap.innerHTML = "";
    if(panel){
      panel.classList.remove("pinned");
      panel.innerHTML = "<div class='tip-placeholder'>Hover over a code line to see an explanation here.</div>";
    }
  }
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("a.annex-link");
    if(!a) return;
    var aid = a.getAttribute("data-annex");
    if(!aid) return;
    var modal = qs("annexModalBackdrop");
    if(modal){ e.preventDefault(); openModal(aid); }
  });
  var closeBtn = qs("annexModalClose");
  if(closeBtn) closeBtn.addEventListener("click", closeModal);
  var bd = qs("annexModalBackdrop");
  if(bd) bd.addEventListener("click", function(e){ if(e.target === bd) closeModal(); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeModal(); });
  var tipPanel = qs("tipPanel");
  function setTip(text){
    if(!tipPanel) return;
    if(!text) { tipPanel.classList.remove("visible"); tipPanel.textContent=""; tipPanel.setAttribute("aria-hidden","true"); return; }
    tipPanel.textContent = text;
    tipPanel.classList.add("visible");
    tipPanel.setAttribute("aria-hidden","false");
  }
  document.querySelectorAll(".code-line[data-tip]").forEach(function(line){ line.addEventListener("click", function(){ setTip(line.getAttribute("data-tip") || ""); }); });

  function escapeRegExp(s){
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightKeywords(){
    var keywords = [
      "ADT","LIFO","FIFO",
      "TopPointer","FrontPointer","RearPointer","RootPointer","NullPointer",
      "FreeListPtr","StartPointer","LeftPointer","RightPointer",
      "SearchItem","NewItem","NodeData"
    ];

    if(!keywords || keywords.length === 0) return;

    var parts = keywords.map(escapeRegExp).join("|");
    var reTest = new RegExp("\\b(" + parts + ")\\b");
    var reGlobal = new RegExp("\\b(" + parts + ")\\b", "g");

    var skipTags = {
      "SCRIPT":1,"STYLE":1,"CODE":1,"PRE":1,"A":1,
      "BUTTON":1,"TEXTAREA":1,"INPUT":1,"SELECT":1
    };

    function isInsideSkipped(el){
      while(el){
        if(el.nodeType === 1){
          if(skipTags[el.tagName]) return true;
          if(el.classList){
            if(el.classList.contains("code-wrap")) return true;
            if(el.classList.contains("annex-modal")) return true;
            if(el.id === "annexModalBackdrop") return true;
          }
        }
        el = el.parentNode;
      }
      return false;
    }

    function wrapTextNode(textNode){
      var text = textNode.nodeValue;
      if(!text || !reTest.test(text)) return;

      var frag = document.createDocumentFragment();
      var last = 0;
      var m;

      reGlobal.lastIndex = 0;
      while((m = reGlobal.exec(text)) !== null){
        var start = m.index;
        var end = start + m[0].length;

        if(start > last){
          frag.appendChild(document.createTextNode(text.slice(last, start)));
        }

        var span = document.createElement("span");
        span.className = "kw";
        span.textContent = m[0];
        frag.appendChild(span);

        last = end;
      }

      if(last < text.length){
        frag.appendChild(document.createTextNode(text.slice(last)));
      }

      textNode.parentNode.replaceChild(frag, textNode);
    }

    document.querySelectorAll(".note-body").forEach(function(root){
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      var node;
      var toWrap = [];

      while((node = walker.nextNode())){
        if(!node.nodeValue || !node.nodeValue.trim()) continue;
        if(isInsideSkipped(node.parentNode)) continue;
        if(reTest.test(node.nodeValue)) toWrap.push(node);
      }

      toWrap.forEach(wrapTextNode);
    });
  }

  function runHighlightKeywords(){
    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", highlightKeywords);
    }else{
      highlightKeywords();
    }
  }

  runHighlightKeywords();

  enrichStaticCodeTips();
})();

(function(){
  var pointId = "19.1";
  var pointTitleEl = document.getElementById("point-title");
  var studentNameEl = document.getElementById("student-name");
  var platformNameEl = document.getElementById("platform-name");
  var studentName = localStorage.getItem("student_name");
  var platform = localStorage.getItem("platform");

  if(studentNameEl && studentName){
    studentNameEl.textContent = "👤 " + studentName;
  }

  if(platformNameEl && platform){
    platformNameEl.textContent = "🎓 Platform: " + platform;
  }

  if(pointTitleEl){
    fetch("../../index.json")
      .then(function(res){ return res.json(); })
      .then(function(list){
        var found = list.find(function(point){
          return point.id && point.id.toLowerCase() === pointId.toLowerCase();
        });
        if(found){
          pointTitleEl.textContent = "📍 " + found.title;
        }
      })
      .catch(function(){});
  }

  var syllabusModal = document.getElementById("syllabus-modal");
  var openButtons = document.querySelectorAll("[data-syllabus-trigger='true']");
  var closeButton = document.getElementById("close-syllabus");

  if(syllabusModal && openButtons.length && closeButton){
    var toggleSyllabus = function(show){
      syllabusModal.classList.toggle("is-open", show);
      syllabusModal.setAttribute("aria-hidden", show ? "false" : "true");
    };

    openButtons.forEach(function(button){
      button.addEventListener("click", function(){
        toggleSyllabus(true);
      });
    });

    closeButton.addEventListener("click", function(){
      toggleSyllabus(false);
    });

    syllabusModal.addEventListener("click", function(event){
      if(event.target === syllabusModal){
        toggleSyllabus(false);
      }
    });
  }
})();
