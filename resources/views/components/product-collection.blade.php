<nav style="display: block;">
    @php
        $quantity = (float) $quantity;
        $unitsPerCollection = (float) ($unitsPerCollection ?: 1);
        $collections = floor($quantity / $unitsPerCollection);
        $remaining = fmod($quantity, $unitsPerCollection);
    @endphp

    @if($inCollections)
        <nav style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
            {{ number_format($collections) }}
            <span style="font-size: 12px;">
                {{ $collectionType ? $collectionType . '(s)' : 'collection' }}
            </span>&nbsp;
            <span>
                {{ $remaining }}
                <span style="font-size: 12px; margin: 0 4px;">
                    {{ $basicQuantity ? $basicQuantity . '(s)' : 'units' }}
                </span>
            </span>
        </nav>
    @else
        <span>
            {{ number_format($quantity) }}
            {{ $basicQuantity ? $basicQuantity . '(s)' : 'units' }}
        </span>
    @endif
</nav>
