<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule; 

class ScheduleController extends Controller
{
    //スケジュールの取得
    public function scheduleindex(Request $request)
    {
        $schedules = Schedule::all();

        return response()->json($schedules);
    }

    //スケジュールの登録処理
    public function create(Request $request)
    {
        $schedules = new Schedule;
        $schedules->sch_date = $request->sch_date;
        $schedules->sch_part = $request->sch_part;
        $schedules->save();

        return response()->json($schedules);
    }

}
