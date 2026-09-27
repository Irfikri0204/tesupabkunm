<?php

namespace App\Filament\Resources\TeamMembers\Pages;

use App\Filament\Resources\TeamMembers\TeamMembersResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

class ListTeamMembers extends ListRecords
{
    protected static string $resource = TeamMembersResource::class;

    protected function getHeaderActions(): array
    {
        $type = request()->query('type', 'dosen');

        return [
            Action::make('dosen')
                ->button()
                ->label('Tim UPA BK UNM')
                ->url($this->getUrl(['type' => 'dosen']))
                ->color($type === 'dosen' ? 'primary' : 'secondary')
                ->outlined($type !== 'dosen')
                ->extraAttributes([
                    'class' => 'rounded-l-full border-r-0',
                ]),
            Action::make('konselor-sebaya')
                ->button()
                ->label('Konselor Sebaya')
                ->url($this->getUrl(['type' => 'konselor-sebaya']))
                ->color($type === 'konselor-sebaya' ? 'primary' : 'secondary')
                ->outlined($type !== 'konselor-sebaya')
                ->extraAttributes([
                    'class' => 'rounded-r-full',
                ]),
            CreateAction::make(),
        ];
    }

    protected function getTableQuery(): Builder | Relation | null
    {
        $type = request()->query('type', 'dosen');

        $query = static::getResource()::getEloquentQuery();

        if (in_array($type, ['dosen', 'konselor-sebaya'], true)) {
            $query->where('type', $type);
        }

        return $query;
    }
}
