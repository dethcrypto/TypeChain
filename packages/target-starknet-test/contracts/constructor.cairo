%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

struct Point:
    member x : felt
    member y : felt
end

struct PointPair:
    member p1 : Point
    member p2 : Point
end

@constructor
func constructor{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(
      point: Point,
      pair: PointPair,
      pairs_len: felt,
      pairs: PointPair*
    ):
    return()
end

@external
func xyz{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(
      point: Point,
      pair: PointPair,
      pairs_len: felt,
      pairs: PointPair*
    ):
    return()
end

